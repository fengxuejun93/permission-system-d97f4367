import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  users as mockUsers,
  friendships as mockFriendships,
  feeds as mockFeeds,
  photos as mockPhotos,
  comments as mockComments,
  replies as mockReplies,
  CURRENT_USER_ID,
  type User,
  type Friendship,
  type Feed,
  type Photo,
  type Comment,
  type Reply,
  type Visibility,
} from '@/data/mock'

export const useSocialStore = defineStore('social', () => {
  // 响应式数据
  const users = ref<User[]>([...mockUsers])
  const friendships = ref<Friendship[]>([...mockFriendships])
  const feeds = ref<Feed[]>([...mockFeeds])
  const photos = ref<Photo[]>([...mockPhotos])
  const comments = ref<Comment[]>([...mockComments])
  const replies = ref<Reply[]>([...mockReplies])

  // 当前用户
  const currentUser = computed(() => users.value.find(u => u.id === CURRENT_USER_ID)!)

  // 获取用户信息
  function getUser(id: string): User | undefined {
    return users.value.find(u => u.id === id)
  }

  // 判断是否是好友（双向）
  function isFriend(userId: string): boolean {
    return friendships.value.some(
      f =>
        ((f.fromId === CURRENT_USER_ID && f.toId === userId) ||
          (f.toId === CURRENT_USER_ID && f.fromId === userId)) &&
        f.status === 'accepted'
    )
  }

  // 获取好友关系状态
  function getFriendshipStatus(userId: string): 'none' | 'pending_sent' | 'pending_received' | 'accepted' {
    const f = friendships.value.find(
      f =>
        (f.fromId === CURRENT_USER_ID && f.toId === userId) ||
        (f.toId === CURRENT_USER_ID && f.fromId === userId)
    )
    if (!f) return 'none'
    if (f.status === 'accepted') return 'accepted'
    if (f.fromId === CURRENT_USER_ID) return 'pending_sent'
    return 'pending_received'
  }

  // 好友列表
  const friendList = computed(() => {
    const friendIds = friendships.value
      .filter(f => f.status === 'accepted' && (f.fromId === CURRENT_USER_ID || f.toId === CURRENT_USER_ID))
      .map(f => (f.fromId === CURRENT_USER_ID ? f.toId : f.fromId))
    return users.value.filter(u => friendIds.includes(u.id))
  })

  // 待处理请求（我收到的）
  const pendingReceived = computed(() => {
    const ids = friendships.value
      .filter(f => f.toId === CURRENT_USER_ID && f.status === 'pending')
      .map(f => f.fromId)
    return users.value.filter(u => ids.includes(u.id))
  })

  // 我发出的待处理请求
  const pendingSent = computed(() => {
    const ids = friendships.value
      .filter(f => f.fromId === CURRENT_USER_ID && f.status === 'pending')
      .map(f => f.toId)
    return users.value.filter(u => ids.includes(u.id))
  })

  // 同学列表（除我以外所有人）
  const classmateList = computed(() => {
    return users.value.filter(u => u.id !== CURRENT_USER_ID)
  })

  // 统计数据
  const friendCount = computed(() => friendList.value.length)
  const pendingRequestCount = computed(() => pendingReceived.value.length)
  const publicPhotoCount = computed(() =>
    photos.value.filter(p => p.visibility === 'public' && p.uploadedBy === CURRENT_USER_ID).length
  )
  const totalCommentCount = computed(() => {
    // 我的所有动态的评论总数（含回复）
    const myFeedIds = feeds.value.filter(f => f.authorId === CURRENT_USER_ID).map(f => f.id)
    const commentCount = comments.value.filter(c => myFeedIds.includes(c.feedId)).length
    const replyCount = comments.value
      .filter(c => myFeedIds.includes(c.feedId))
      .reduce((acc, c) => {
        return acc + replies.value.filter(r => r.commentId === c.id).length
      }, 0)
    return commentCount + replyCount
  })

  // 动态流（好友动态+公开动态，按时间倒序）
  const feedList = computed(() => {
    const friendIds = new Set(friendList.value.map(u => u.id))
    return feeds.value
      .filter(f => {
        if (f.authorId === CURRENT_USER_ID) return true
        if (friendIds.has(f.authorId)) return true
        // 非好友的公开动态也可见
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  })

  // 获取动态的可见照片
  function getVisiblePhotosForFeed(feedId: string): Photo[] {
    const friendIds = new Set(friendList.value.map(u => u.id))
    return photos.value.filter(p => {
      if (p.feedId !== feedId) return false
      if (p.uploadedBy === CURRENT_USER_ID) return true
      if (p.visibility === 'public') return true
      if (p.visibility === 'friends' && friendIds.has(p.uploadedBy)) return true
      return false
    })
  }

  // 获取动态的所有照片（含不可见标记）
  function getAllPhotosForFeed(feedId: string): (Photo & { canView: boolean; visibilityLabel: string })[] {
    const friendIds = new Set(friendList.value.map(u => u.id))
    return photos.value
      .filter(p => p.feedId === feedId)
      .map(p => {
        const canView =
          p.uploadedBy === CURRENT_USER_ID ||
          p.visibility === 'public' ||
          (p.visibility === 'friends' && friendIds.has(p.uploadedBy))
        const visibilityLabel =
          p.visibility === 'public'
            ? '公开'
            : p.visibility === 'friends'
              ? '仅好友'
              : '仅自己'
        return { ...p, canView, visibilityLabel }
      })
  }

  // 获取动态详情
  function getFeedDetail(feedId: string) {
    const feed = feeds.value.find(f => f.id === feedId)
    if (!feed) return null
    const author = getUser(feed.authorId)
    const feedPhotos = getAllPhotosForFeed(feedId)
    const feedComments = comments.value
      .filter(c => c.feedId === feedId)
      .map(c => {
        const author = getUser(c.authorId)
        const commentReplies = replies.value
          .filter(r => r.commentId === c.id)
          .map(r => ({ ...r, author: getUser(r.authorId) }))
        return { ...c, author, replies: commentReplies }
      })
    return { ...feed, author, photos: feedPhotos, comments: feedComments }
  }

  // 搜索同学
  function searchClassmates(keyword: string): User[] {
    if (!keyword.trim()) return classmateList.value
    const kw = keyword.trim().toLowerCase()
    return classmateList.value.filter(
      u => u.name.toLowerCase().includes(kw) || u.className.toLowerCase().includes(kw)
    )
  }

  // 加好友
  function addFriend(userId: string) {
    const existing = friendships.value.find(
      f =>
        (f.fromId === CURRENT_USER_ID && f.toId === userId) ||
        (f.toId === CURRENT_USER_ID && f.fromId === userId)
    )
    if (existing) return
    friendships.value.push({
      id: `f${Date.now()}`,
      fromId: CURRENT_USER_ID,
      toId: userId,
      status: 'pending',
    })
  }

  // 接受好友请求
  function acceptFriend(userId: string) {
    const f = friendships.value.find(
      f => f.fromId === userId && f.toId === CURRENT_USER_ID && f.status === 'pending'
    )
    if (f) f.status = 'accepted'
  }

  // 取消好友/拒绝请求
  function removeFriend(userId: string) {
    const idx = friendships.value.findIndex(
      f =>
        ((f.fromId === CURRENT_USER_ID && f.toId === userId) ||
          (f.toId === CURRENT_USER_ID && f.fromId === userId))
    )
    if (idx !== -1) friendships.value.splice(idx, 1)
  }

  // 添加评论
  function addComment(feedId: string, content: string) {
    comments.value.push({
      id: `c${Date.now()}`,
      feedId,
      authorId: CURRENT_USER_ID,
      content,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
    })
  }

  // 添加回复
  function addReply(commentId: string, content: string) {
    replies.value.push({
      id: `r${Date.now()}`,
      commentId,
      authorId: CURRENT_USER_ID,
      content,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
    })
  }

  // 更新照片可见性
  function updatePhotoVisibility(photoId: string, visibility: Visibility) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo && photo.uploadedBy === CURRENT_USER_ID) {
      photo.visibility = visibility
    }
  }

  // 我的照片（相册）
  const myPhotos = computed(() =>
    photos.value.filter(p => p.uploadedBy === CURRENT_USER_ID)
  )

  // 获取动态的评论数
  function getCommentCount(feedId: string): number {
    const c = comments.value.filter(c => c.feedId === feedId).length
    const r = comments.value
      .filter(c => c.feedId === feedId)
      .reduce((acc, c) => acc + replies.value.filter(r => r.commentId === c.id).length, 0)
    return c + r
  }

  return {
    users,
    friendships,
    feeds,
    photos,
    comments,
    replies,
    currentUser,
    friendList,
    pendingReceived,
    pendingSent,
    classmateList,
    friendCount,
    pendingRequestCount,
    publicPhotoCount,
    totalCommentCount,
    feedList,
    myPhotos,
    getUser,
    isFriend,
    getFriendshipStatus,
    getVisiblePhotosForFeed,
    getAllPhotosForFeed,
    getFeedDetail,
    searchClassmates,
    addFriend,
    acceptFriend,
    removeFriend,
    addComment,
    addReply,
    updatePhotoVisibility,
    getCommentCount,
  }
})
