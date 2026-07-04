import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  users as mockUsers,
  friendships as mockFriendships,
  feeds as mockFeeds,
  photos as mockPhotos,
  comments as mockComments,
  replies as mockReplies,
  likes as mockLikes,
  CURRENT_USER_ID,
  type User,
  type Friendship,
  type Feed,
  type Photo,
  type Comment,
  type Reply,
  type Like,
  type Visibility,
} from '@/data/mock'

export const useSocialStore = defineStore('social', () => {
  const users = ref<User[]>([...mockUsers])
  const friendships = ref<Friendship[]>([...mockFriendships])
  const feeds = ref<Feed[]>([...mockFeeds])
  const photos = ref<Photo[]>([...mockPhotos])
  const comments = ref<Comment[]>([...mockComments])
  const replies = ref<Reply[]>([...mockReplies])
  const likes = ref<Like[]>([...mockLikes])

  const currentUser = computed(() => users.value.find(u => u.id === CURRENT_USER_ID)!)

  function getUser(id: string): User | undefined {
    return users.value.find(u => u.id === id)
  }

  function isFriend(userId: string): boolean {
    return friendships.value.some(
      f =>
        ((f.fromId === CURRENT_USER_ID && f.toId === userId) ||
          (f.toId === CURRENT_USER_ID && f.fromId === userId)) &&
        f.status === 'accepted'
    )
  }

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

  // 获取某用户的所有好友ID
  function getFriendIdsOf(userId: string): string[] {
    return friendships.value
      .filter(f => f.status === 'accepted' && (f.fromId === userId || f.toId === userId))
      .map(f => (f.fromId === userId ? f.toId : f.fromId))
  }

  // 共同好友
  function getMutualFriends(userId: string): User[] {
    const myFriends = new Set(getFriendIdsOf(CURRENT_USER_ID))
    const theirFriends = getFriendIdsOf(userId)
    const mutualIds = theirFriends.filter(id => myFriends.has(id))
    return users.value.filter(u => mutualIds.includes(u.id))
  }

  const friendList = computed(() => {
    const friendIds = getFriendIdsOf(CURRENT_USER_ID)
    return users.value.filter(u => friendIds.includes(u.id))
  })

  const pendingReceived = computed(() => {
    const ids = friendships.value
      .filter(f => f.toId === CURRENT_USER_ID && f.status === 'pending')
      .map(f => f.fromId)
    return users.value.filter(u => ids.includes(u.id))
  })

  const pendingSent = computed(() => {
    const ids = friendships.value
      .filter(f => f.fromId === CURRENT_USER_ID && f.status === 'pending')
      .map(f => f.toId)
    return users.value.filter(u => ids.includes(u.id))
  })

  const classmateList = computed(() => users.value.filter(u => u.id !== CURRENT_USER_ID))

  // 统计
  const friendCount = computed(() => friendList.value.length)
  const pendingRequestCount = computed(() => pendingReceived.value.length)
  const publicPhotoCount = computed(() =>
    photos.value.filter(p => p.visibility === 'public' && p.uploadedBy === CURRENT_USER_ID).length
  )
  const totalCommentCount = computed(() => {
    const myFeedIds = feeds.value.filter(f => f.authorId === CURRENT_USER_ID).map(f => f.id)
    const cCount = comments.value.filter(c => myFeedIds.includes(c.feedId)).length
    const rCount = comments.value
      .filter(c => myFeedIds.includes(c.feedId))
      .reduce((acc, c) => acc + replies.value.filter(r => r.commentId === c.id).length, 0)
    return cCount + rCount
  })
  const totalLikeCount = computed(() =>
    likes.value.filter(l => {
      const feed = feeds.value.find(f => f.id === l.feedId)
      return feed && feed.authorId === CURRENT_USER_ID
    }).length
  )

  // 动态流
  const feedList = computed(() =>
    feeds.value.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )

  // 照片可见性判断
  function canViewPhoto(photo: Photo): boolean {
    if (photo.uploadedBy === CURRENT_USER_ID) return true
    if (photo.visibility === 'public') return true
    if (photo.visibility === 'friends' && isFriend(photo.uploadedBy)) return true
    return false
  }

  function getVisibilityLabel(vis: Visibility): string {
    return vis === 'public' ? '公开' : vis === 'friends' ? '仅好友' : '仅自己'
  }

  // 获取动态的可见照片
  function getVisiblePhotosForFeed(feedId: string): Photo[] {
    return photos.value.filter(p => p.feedId === feedId && canViewPhoto(p))
  }

  // 获取动态的所有照片（含不可见标记）
  function getAllPhotosForFeed(feedId: string): (Photo & { canView: boolean; visibilityLabel: string })[] {
    return photos.value
      .filter(p => p.feedId === feedId)
      .map(p => ({ ...p, canView: canViewPhoto(p), visibilityLabel: getVisibilityLabel(p.visibility) }))
  }

  // 获取动态详情
  function getFeedDetail(feedId: string) {
    const feed = feeds.value.find(f => f.id === feedId)
    if (!feed) return null
    const author = getUser(feed.authorId)
    const feedPhotos = getAllPhotosForFeed(feedId)
    const feedComments = comments.value
      .filter(c => c.feedId === feedId)
      .map(c => ({
        ...c,
        author: getUser(c.authorId),
        replies: replies.value
          .filter(r => r.commentId === c.id)
          .map(r => ({ ...r, author: getUser(r.authorId) })),
      }))
    const isLiked = likes.value.some(l => l.feedId === feedId && l.userId === CURRENT_USER_ID)
    const likeCount = likes.value.filter(l => l.feedId === feedId).length
    return { ...feed, author, photos: feedPhotos, comments: feedComments, isLiked, likeCount }
  }

  // 获取照片详情
  function getPhotoDetail(photoId: string) {
    const photo = photos.value.find(p => p.id === photoId)
    if (!photo) return null
    const canView = canViewPhoto(photo)
    const uploader = getUser(photo.uploadedBy)
    const feed = feeds.value.find(f => f.id === photo.feedId)
    // 照片评论复用其所属动态的评论
    const photoComments = feed
      ? comments.value
          .filter(c => c.feedId === feed.id)
          .map(c => ({
            ...c,
            author: getUser(c.authorId),
            replies: replies.value
              .filter(r => r.commentId === c.id)
              .map(r => ({ ...r, author: getUser(r.authorId) })),
          }))
      : []
    return {
      ...photo,
      canView,
      visibilityLabel: getVisibilityLabel(photo.visibility),
      uploader,
      feed,
      comments: photoComments,
    }
  }

  // 获取同学资料详情
  function getClassmateDetail(userId: string) {
    const user = getUser(userId)
    if (!user) return null
    const status = getFriendshipStatus(userId)
    const mutualFriends = getMutualFriends(userId)
    const userFriendCount = getFriendIdsOf(userId).length
    const recentFeeds = feeds.value
      .filter(f => f.authorId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
      .map(f => ({
        ...f,
        photos: getAllPhotosForFeed(f.id),
        commentCount: getCommentCount(f.id),
        likeCount: likes.value.filter(l => l.feedId === f.id).length,
      }))
    const userPhotos = photos.value.filter(p => p.uploadedBy === userId && canViewPhoto(p))
    return {
      ...user,
      status,
      mutualFriends,
      userFriendCount,
      recentFeeds,
      userPhotos,
    }
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

  function acceptFriend(userId: string) {
    const f = friendships.value.find(
      f => f.fromId === userId && f.toId === CURRENT_USER_ID && f.status === 'pending'
    )
    if (f) f.status = 'accepted'
  }

  function removeFriend(userId: string) {
    const idx = friendships.value.findIndex(
      f =>
        ((f.fromId === CURRENT_USER_ID && f.toId === userId) ||
          (f.toId === CURRENT_USER_ID && f.fromId === userId))
    )
    if (idx !== -1) friendships.value.splice(idx, 1)
  }

  // 点赞/取消点赞
  function toggleLike(feedId: string) {
    const idx = likes.value.findIndex(l => l.feedId === feedId && l.userId === CURRENT_USER_ID)
    const feed = feeds.value.find(f => f.id === feedId)
    if (idx !== -1) {
      likes.value.splice(idx, 1)
      if (feed) feed.likeCount = Math.max(0, feed.likeCount - 1)
    } else {
      likes.value.push({ id: `lk${Date.now()}`, feedId, userId: CURRENT_USER_ID })
      if (feed) feed.likeCount++
    }
  }

  function isLikedByMe(feedId: string): boolean {
    return likes.value.some(l => l.feedId === feedId && l.userId === CURRENT_USER_ID)
  }

  // 评论
  function addComment(feedId: string, content: string) {
    comments.value.push({
      id: `c${Date.now()}`,
      feedId,
      authorId: CURRENT_USER_ID,
      content,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      likeCount: 0,
    })
  }

  function addReply(commentId: string, content: string) {
    replies.value.push({
      id: `r${Date.now()}`,
      commentId,
      authorId: CURRENT_USER_ID,
      content,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      likeCount: 0,
    })
  }

  function updatePhotoVisibility(photoId: string, visibility: Visibility) {
    const photo = photos.value.find(p => p.id === photoId)
    if (photo && photo.uploadedBy === CURRENT_USER_ID) {
      photo.visibility = visibility
    }
  }

  const myPhotos = computed(() => photos.value.filter(p => p.uploadedBy === CURRENT_USER_ID))

  function getCommentCount(feedId: string): number {
    const c = comments.value.filter(c => c.feedId === feedId).length
    const r = comments.value
      .filter(c => c.feedId === feedId)
      .reduce((acc, c) => acc + replies.value.filter(r => r.commentId === c.id).length, 0)
    return c + r
  }

  function getLikeCount(feedId: string): number {
    return likes.value.filter(l => l.feedId === feedId).length
  }

  return {
    users, friendships, feeds, photos, comments, replies, likes,
    currentUser, friendList, pendingReceived, pendingSent, classmateList,
    friendCount, pendingRequestCount, publicPhotoCount, totalCommentCount, totalLikeCount,
    feedList, myPhotos,
    getUser, isFriend, getFriendshipStatus, getMutualFriends,
    getVisiblePhotosForFeed, getAllPhotosForFeed, getFeedDetail, getPhotoDetail, getClassmateDetail,
    searchClassmates, addFriend, acceptFriend, removeFriend,
    toggleLike, isLikedByMe, addComment, addReply, updatePhotoVisibility,
    getCommentCount, getLikeCount, canViewPhoto, getVisibilityLabel,
  }
})
