<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { ArrowLeft, Lock, Eye, Users, MessageSquare, Send, ThumbsUp, UserCircle, Heart } from 'lucide-vue-next'
import type { Visibility } from '@/data/mock'

const route = useRoute()
const router = useRouter()
const store = useSocialStore()

const photoId = route.params.id as string
const detail = computed(() => store.getPhotoDetail(photoId))

const newComment = ref('')
const replyTo = ref<string | null>(null)
const replyContent = ref('')

function submitComment() {
  if (!detail.value?.feed || !newComment.value.trim()) return
  store.addComment(detail.value.feed.id, newComment.value.trim())
  newComment.value = ''
}

function submitReply(commentId: string) {
  if (!replyContent.value.trim()) return
  store.addReply(commentId, replyContent.value.trim())
  replyContent.value = ''
  replyTo.value = null
}

function startReply(commentId: string) {
  replyTo.value = replyTo.value === commentId ? null : commentId
  replyContent.value = ''
}

function getVisibilityColor(vis: Visibility) {
  switch (vis) {
    case 'public': return 'bg-green-100 text-green-700'
    case 'friends': return 'bg-amber-100 text-amber-700'
    case 'self': return 'bg-red-100 text-red-700'
  }
}

function getVisibilityBadgeColor(vis: Visibility) {
  switch (vis) {
    case 'public': return 'bg-green-500'
    case 'friends': return 'bg-amber-500'
    case 'self': return 'bg-red-500'
  }
}

function canComment(): boolean {
  if (!detail.value) return false
  // 自己的照片可以评论
  if (detail.value.uploadedBy === store.currentUser.id) return true
  // 公开照片可以评论
  if (detail.value.visibility === 'public') return true
  // 仅好友且是好友可以评论
  if (detail.value.visibility === 'friends' && store.isFriend(detail.value.uploadedBy)) return true
  return false
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/album')
}
</script>

<template>
  <div v-if="detail">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between mb-4">
      <button @click="goBack" class="flex items-center gap-1 text-sm text-[#4A7FB5] hover:text-[#1B3A5C] transition-colors">
        <ArrowLeft :size="16" /><span>返回</span>
      </button>
      <div class="flex items-center gap-3">
        <button
          v-if="detail.feed"
          @click="router.push(`/feed/${detail.feed.id}`)"
          class="flex items-center gap-1 text-xs text-[#4A7FB5] hover:text-[#1B3A5C]"
        >
          <MessageSquare :size="14" /><span>查看所属动态</span>
        </button>
        <button
          @click="router.push(`/classmate/${detail.uploadedBy}`)"
          class="flex items-center gap-1 text-xs text-[#4A7FB5] hover:text-[#1B3A5C]"
        >
          <UserCircle :size="14" /><span>查看上传者</span>
        </button>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- 照片主体 -->
      <div class="flex-1">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div v-if="detail.canView">
            <img :src="detail.url" :alt="detail.caption" class="w-full" loading="lazy" />
          </div>
          <div v-else class="bg-gray-100 flex items-center justify-center" style="min-height:300px">
            <div class="text-center">
              <Lock :size="40" class="mx-auto text-gray-300 mb-3" />
              <p class="text-base text-gray-500">此照片仅{{ detail.visibilityLabel }}可见</p>
              <p class="text-xs text-gray-400 mt-1">与上传者成为好友后即可查看</p>
            </div>
          </div>

          <!-- 照片信息 -->
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-[#1B3A5C]">{{ detail.caption }}</h3>
                <div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>上传于 {{ detail.createdAt }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" :class="getVisibilityColor(detail.visibility)">
                  <component :is="detail.visibility === 'public' ? Eye : detail.visibility === 'friends' ? Users : Lock" :size="12" />
                  {{ detail.visibilityLabel }}
                </span>
                <div class="w-3 h-3 rounded-full border-2 border-white shadow-sm" :class="getVisibilityBadgeColor(detail.visibility)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息栏 -->
      <div class="hidden lg:block w-72 space-y-3">
        <!-- 上传者信息卡 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              :class="store.isFriend(detail.uploadedBy) ? 'bg-[#4CAF50]' : 'bg-[#4A7FB5]'"
              @click="router.push(`/classmate/${detail.uploadedBy}`)"
            >{{ detail.uploader?.name.charAt(0) }}</div>
            <div>
              <div class="text-sm font-semibold text-[#1B3A5C] cursor-pointer hover:text-[#4A7FB5]" @click="router.push(`/classmate/${detail.uploadedBy}`)">{{ detail.uploader?.name }}</div>
              <div class="text-xs text-gray-500">{{ detail.uploader?.className }}</div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500">{{ detail.uploader?.bio }}</div>
          <div v-if="detail.uploadedBy !== store.currentUser.id" class="mt-3">
            <span v-if="store.isFriend(detail.uploadedBy)" class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">已好友</span>
            <span v-else-if="store.getFriendshipStatus(detail.uploadedBy) === 'pending_sent'" class="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">待确认</span>
            <button v-else-if="store.getFriendshipStatus(detail.uploadedBy) === 'pending_received'" @click="store.acceptFriend(detail.uploadedBy)" class="text-xs px-3 py-1 bg-[#E8533F] text-white rounded hover:bg-red-600">接受好友</button>
            <button v-else @click="store.addFriend(detail.uploadedBy)" class="text-xs px-3 py-1 bg-[#4A7FB5] text-white rounded hover:bg-[#1B3A5C]">加好友</button>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h4 class="text-xs font-semibold text-[#1B3A5C] mb-3 flex items-center gap-1">
            <MessageSquare :size="12" /> 评论 ({{ detail.comments.length }})
          </h4>

          <!-- 评论输入 -->
          <div v-if="canComment()" class="flex gap-2 mb-3">
            <input v-model="newComment" type="text" placeholder="发表评论..." class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FB5]" @keyup.enter="submitComment" />
            <button @click="submitComment" :disabled="!newComment.trim()" class="px-2 py-1.5 bg-[#4A7FB5] text-white text-xs rounded hover:bg-[#1B3A5C] disabled:opacity-50">
              <Send :size="12" />
            </button>
          </div>
          <div v-else class="mb-3 p-2 bg-amber-50 rounded text-xs text-amber-600 flex items-center gap-1">
            <Lock :size="10" />权限不足，无法评论此照片
          </div>

          <!-- 评论列表 -->
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div v-for="comment in detail.comments" :key="comment.id" class="border-b border-gray-50 pb-2 last:border-0">
              <div class="flex gap-2">
                <div class="w-6 h-6 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white text-xs flex-shrink-0 cursor-pointer" @click="router.push(`/classmate/${comment.authorId}`)">{{ comment.author?.name.charAt(0) }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-medium text-[#1B3A5C]">{{ comment.author?.name }}</span>
                    <span class="text-xs text-gray-400">{{ comment.createdAt }}</span>
                  </div>
                  <p class="text-xs text-gray-700 mt-0.5">{{ comment.content }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <button v-if="canComment()" @click="startReply(comment.id)" class="text-xs text-[#4A7FB5]">回复</button>
                    <span class="flex items-center gap-0.5 text-xs text-gray-400"><ThumbsUp :size="9" />{{ comment.likeCount }}</span>
                  </div>
                  <div v-if="replyTo === comment.id" class="flex gap-1 mt-1">
                    <input v-model="replyContent" type="text" :placeholder="`回复...`" class="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FB5]" @keyup.enter="submitReply(comment.id)" />
                    <button @click="submitReply(comment.id)" :disabled="!replyContent.trim()" class="px-2 py-1 bg-[#4A7FB5] text-white text-xs rounded disabled:opacity-50">发送</button>
                  </div>
                  <div v-if="comment.replies.length > 0" class="mt-1 ml-3 pl-2 border-l border-gray-100 space-y-1">
                    <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-1">
                      <div class="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs flex-shrink-0">{{ reply.author?.name.charAt(0) }}</div>
                      <div>
                        <span class="text-xs font-medium text-[#1B3A5C]">{{ reply.author?.name }}</span>
                        <span class="text-xs text-gray-600 ml-0.5">{{ reply.content }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-400 py-12">照片不存在</div>
</template>
