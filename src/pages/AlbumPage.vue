<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { Eye, Users, Lock } from 'lucide-vue-next'
import type { Visibility } from '@/data/mock'

const router = useRouter()
const store = useSocialStore()

const visibilityOptions: { value: Visibility; label: string; icon: any; desc: string }[] = [
  { value: 'public', label: '公开', icon: Eye, desc: '所有人可见' },
  { value: 'friends', label: '仅好友', icon: Users, desc: '仅好友可见' },
  { value: 'self', label: '仅自己', icon: Lock, desc: '仅自己可见' },
]

function getVisibilityColor(vis: Visibility) {
  switch (vis) {
    case 'public': return 'bg-green-100 text-green-700 border-green-200'
    case 'friends': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'self': return 'bg-red-100 text-red-700 border-red-200'
  }
}

function getVisibilityBadgeColor(vis: Visibility) {
  switch (vis) {
    case 'public': return 'bg-green-500'
    case 'friends': return 'bg-amber-500'
    case 'self': return 'bg-red-500'
  }
}
</script>

<template>
  <div>
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F8A] rounded-lg p-6 mb-4 text-white">
      <h2 class="text-xl font-serif">我的相册</h2>
      <p class="text-sm text-blue-200 mt-1">管理你的照片可见性，切换后动态和详情页将即时同步</p>
      <div class="flex gap-6 mt-3">
        <div class="text-center">
          <div class="text-2xl font-bold">{{ store.myPhotos.length }}</div>
          <div class="text-xs text-blue-200">总照片</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-300">{{ store.publicPhotoCount }}</div>
          <div class="text-xs text-blue-200">公开</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-300">{{ store.myPhotos.filter(p => p.visibility === 'friends').length }}</div>
          <div class="text-xs text-blue-200">仅好友</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-300">{{ store.myPhotos.filter(p => p.visibility === 'self').length }}</div>
          <div class="text-xs text-blue-200">仅自己</div>
        </div>
      </div>
    </div>

    <!-- 照片网格 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="photo in store.myPhotos"
        :key="photo.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden group"
      >
        <!-- 照片可点击进入详情 -->
        <div
          class="relative aspect-[4/3] overflow-hidden cursor-pointer"
          @click="router.push(`/photo/${photo.id}`)"
        >
          <img
            :src="photo.url"
            :alt="photo.caption"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <!-- 可见性徽标 -->
          <div
            class="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white"
            :class="getVisibilityBadgeColor(photo.visibility)"
            :title="photo.visibility === 'public' ? '公开' : photo.visibility === 'friends' ? '仅好友' : '仅自己'"
          />
        </div>

        <!-- 信息区 -->
        <div class="p-3">
          <p class="text-xs text-gray-700 mb-2 truncate cursor-pointer hover:text-[#4A7FB5]" @click="router.push(`/photo/${photo.id}`)">{{ photo.caption }}</p>

          <!-- 当前可见性标签 -->
          <div
            class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-2"
            :class="getVisibilityColor(photo.visibility)"
          >
            <component :is="visibilityOptions.find(o => o.value === photo.visibility)?.icon" :size="10" />
            {{ visibilityOptions.find(o => o.value === photo.visibility)?.label }}
          </div>

          <!-- 可见性切换 -->
          <div class="flex gap-1" @click.stop>
            <button
              v-for="opt in visibilityOptions"
              :key="opt.value"
              @click="store.updatePhotoVisibility(photo.id, opt.value)"
              class="flex-1 text-xs py-1 rounded transition-colors"
              :class="[
                photo.visibility === opt.value
                  ? 'bg-[#1B3A5C] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              ]"
              :title="opt.desc"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="store.myPhotos.length === 0" class="text-center text-gray-400 py-12">暂无照片</div>
  </div>
</template>
