<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { MessageSquare, Lock, Heart, Eye } from 'lucide-vue-next'

const router = useRouter()
const store = useSocialStore()

const feedItems = computed(() =>
  store.feedList.map(feed => {
    const author = store.getUser(feed.authorId)
    const photos = store.getVisiblePhotosForFeed(feed.id)
    const allPhotos = store.getAllPhotosForFeed(feed.id)
    const hasRestricted = allPhotos.some(p => !p.canView)
    const commentCount = store.getCommentCount(feed.id)
    const likeCount = store.getLikeCount(feed.id)
    const isLiked = store.isLikedByMe(feed.id)
    return { ...feed, author, photos, allPhotos, hasRestricted, commentCount, likeCount, isLiked }
  })
)
</script>

<template>
  <div>
    <!-- 顶部横幅 -->
    <div class="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F8A] rounded-lg p-6 mb-4 text-white">
      <h2 class="text-xl font-serif">你好，{{ store.currentUser.name }}</h2>
      <p class="text-sm text-blue-200 mt-1">看看同学们最近都在做什么</p>
      <div class="flex gap-6 mt-3">
        <div class="text-center">
          <div class="text-2xl font-bold">{{ store.friendCount }}</div>
          <div class="text-xs text-blue-200">好友</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-[#E8533F]">{{ store.pendingRequestCount }}</div>
          <div class="text-xs text-blue-200">待处理</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold">{{ store.publicPhotoCount }}</div>
          <div class="text-xs text-blue-200">公开照片</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-300">{{ store.totalLikeCount }}</div>
          <div class="text-xs text-blue-200">获赞</div>
        </div>
      </div>
    </div>

    <!-- 动态列表 -->
    <div class="space-y-3">
      <div
        v-for="item in feedItems"
        :key="item.id"
        class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="router.push(`/feed/${item.id}`)"
      >
        <div class="flex gap-3">
          <!-- 头像可跳转同学资料 -->
          <div
            class="w-10 h-10 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 hover:opacity-80"
            @click.stop="router.push(`/classmate/${item.authorId}`)"
          >
            {{ item.author?.name.charAt(0) || '?' }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-semibold text-[#1B3A5C] hover:text-[#4A7FB5] cursor-pointer"
                @click.stop="router.push(`/classmate/${item.authorId}`)"
              >{{ item.author?.name }}</span>
              <span class="text-xs text-gray-400">{{ item.createdAt }}</span>
              <span
                v-if="!store.isFriend(item.authorId) && item.authorId !== store.currentUser.id"
                class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
              >非好友</span>
            </div>

            <p class="text-sm text-gray-700 mt-1">{{ item.content }}</p>

            <!-- 照片缩略图（可点击进照片详情） -->
            <div v-if="item.photos.length > 0" class="flex gap-2 mt-2">
              <div
                v-for="photo in item.photos.slice(0, 3)"
                :key="photo.id"
                class="relative w-28 h-20 rounded overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80"
                @click.stop="router.push(`/photo/${photo.id}`)"
              >
                <img :src="photo.url" :alt="photo.caption" class="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <!-- 权限提示 -->
            <div v-if="item.hasRestricted" class="flex items-center gap-1 mt-2 text-xs text-amber-600">
              <Lock :size="12" />
              <span>部分照片受权限保护</span>
            </div>

            <!-- 底部互动信息 -->
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-1 text-xs" :class="item.isLiked ? 'text-red-500' : 'text-gray-400'">
                <Heart :size="12" :fill="item.isLiked ? 'currentColor' : 'none'" />
                <span>{{ item.likeCount }}</span>
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-400">
                <MessageSquare :size="12" />
                <span>{{ item.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="feedItems.length === 0" class="text-center text-gray-400 py-12">暂无动态</div>
  </div>
</template>
