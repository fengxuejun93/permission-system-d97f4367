<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { ArrowLeft, MessageSquare, Send, Lock, Eye } from 'lucide-vue-next'
import type { Visibility } from '@/data/mock'

const route = useRoute()
const router = useRouter()
const store = useSocialStore()

const feedId = route.params.id as string
const detail = computed(() => store.getFeedDetail(feedId))

const newComment = ref('')
const replyTo = ref<string | null>(null)
const replyContent = ref('')

function submitComment() {
  if (!newComment.value.trim()) return
  store.addComment(feedId, newComment.value.trim())
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

function getVisibilityIcon(vis: Visibility) {
  switch (vis) {
    case 'public': return Eye
    case 'friends': return Lock
    case 'self': return Lock
  }
}
</script>

<template>
  <div v-if="detail">
    <!-- 返回按钮 -->
    <button
      @click="router.push('/')"
      class="flex items-center gap-1 text-sm text-[#4A7FB5] hover:text-[#1B3A5C] mb-4 transition-colors"
    >
      <ArrowLeft :size="16" />
      <span>返回动态首页</span>
    </button>

    <!-- 动态详情卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-5 mb-4">
      <div class="flex gap-3">
        <div class="w-12 h-12 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white font-bold flex-shrink-0">
          {{ detail.author?.name.charAt(0) || '?' }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="text-base font-semibold text-[#1B3A5C]">{{ detail.author?.name }}</span>
            <span class="text-xs text-gray-400">{{ detail.createdAt }}</span>
          </div>
          <p class="text-sm text-gray-700 mt-2 leading-relaxed">{{ detail.content }}</p>

          <!-- 照片展示 -->
          <div class="mt-4 space-y-3">
            <div v-for="photo in detail.photos" :key="photo.id" class="relative">
              <div v-if="photo.canView">
                <img
                  :src="photo.url"
                  :alt="photo.caption"
                  class="max-w-full rounded-lg border border-gray-200"
                  loading="lazy"
                />
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-gray-500">{{ photo.caption }}</span>
                  <span
                    class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    :class="getVisibilityColor(photo.visibility)"
                  >
                    <component :is="getVisibilityIcon(photo.visibility)" :size="10" />
                    {{ photo.visibilityLabel }}
                  </span>
                </div>
              </div>
              <div v-else class="bg-gray-100 rounded-lg p-8 text-center">
                <Lock :size="24" class="mx-auto text-gray-400 mb-2" />
                <p class="text-sm text-gray-500">此照片仅{{ photo.visibilityLabel }}可见</p>
                <span
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-2"
                  :class="getVisibilityColor(photo.visibility)"
                >
                  {{ photo.visibilityLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="bg-white rounded-lg shadow-sm p-5">
      <h3 class="text-sm font-semibold text-[#1B3A5C] mb-4 flex items-center gap-2">
        <MessageSquare :size="16" />
        评论 ({{ detail.comments.length }})
      </h3>

      <!-- 发表评论 -->
      <div class="flex gap-2 mb-4">
        <input
          v-model="newComment"
          type="text"
          placeholder="发表评论..."
          class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A7FB5]"
          @keyup.enter="submitComment"
        />
        <button
          @click="submitComment"
          :disabled="!newComment.trim()"
          class="px-4 py-2 bg-[#4A7FB5] text-white text-sm rounded-lg hover:bg-[#1B3A5C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <Send :size="14" />
          发表
        </button>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-4">
        <div v-for="comment in detail.comments" :key="comment.id" class="border-b border-gray-100 pb-3 last:border-0">
          <!-- 评论主体 -->
          <div class="flex gap-2">
            <div class="w-8 h-8 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ comment.author?.name.charAt(0) || '?' }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-[#1B3A5C]">{{ comment.author?.name }}</span>
                <span class="text-xs text-gray-400">{{ comment.createdAt }}</span>
              </div>
              <p class="text-sm text-gray-700 mt-0.5">{{ comment.content }}</p>
              <button
                @click="startReply(comment.id)"
                class="text-xs text-[#4A7FB5] hover:text-[#1B3A5C] mt-1"
              >
                回复
              </button>

              <!-- 回复输入框 -->
              <div v-if="replyTo === comment.id" class="flex gap-2 mt-2">
                <input
                  v-model="replyContent"
                  type="text"
                  :placeholder="`回复 ${comment.author?.name}...`"
                  class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FB5]"
                  @keyup.enter="submitReply(comment.id)"
                />
                <button
                  @click="submitReply(comment.id)"
                  :disabled="!replyContent.trim()"
                  class="px-3 py-1.5 bg-[#4A7FB5] text-white text-xs rounded hover:bg-[#1B3A5C] disabled:opacity-50 transition-colors"
                >
                  回复
                </button>
              </div>

              <!-- 回复列表 -->
              <div v-if="comment.replies.length > 0" class="mt-2 ml-4 pl-3 border-l-2 border-gray-100 space-y-2">
                <div v-for="reply in comment.replies" :key="reply.id" class="flex gap-2">
                  <div class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs flex-shrink-0">
                    {{ reply.author?.name.charAt(0) || '?' }}
                  </div>
                  <div>
                    <span class="text-xs font-medium text-[#1B3A5C]">{{ reply.author?.name }}</span>
                    <span class="text-xs text-gray-700 ml-1">{{ reply.content }}</span>
                    <div class="text-xs text-gray-400 mt-0.5">{{ reply.createdAt }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="detail.comments.length === 0" class="text-center text-gray-400 text-sm py-6">
        暂无评论，快来抢沙发！
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-400 py-12">
    动态不存在
  </div>
</template>
