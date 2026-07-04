<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { ArrowLeft, UserPlus, UserMinus, UserCheck, Clock, Heart, MessageSquare, Users, MapPin, Calendar, GraduationCap } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useSocialStore()

const userId = route.params.id as string
const detail = computed(() => store.getClassmateDetail(userId))

function getStatusInfo() {
  if (!detail.value) return null
  const status = detail.value.status
  switch (status) {
    case 'accepted':
      return { label: '解除好友', class: 'border border-red-300 text-red-500 hover:bg-red-50', icon: UserMinus, action: () => store.removeFriend(userId) }
    case 'pending_sent':
      return { label: '取消申请', class: 'border border-gray-300 text-gray-500 hover:bg-gray-50', icon: Clock, action: () => store.removeFriend(userId) }
    case 'pending_received':
      return { label: '接受好友', class: 'bg-[#4CAF50] text-white hover:bg-green-600', icon: UserCheck, action: () => store.acceptFriend(userId) }
    default:
      return { label: '加好友', class: 'bg-[#4A7FB5] text-white hover:bg-[#1B3A5C]', icon: UserPlus, action: () => store.addFriend(userId) }
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/classmates')
}
</script>

<template>
  <div v-if="detail">
    <!-- 返回 -->
    <button @click="goBack" class="flex items-center gap-1 text-sm text-[#4A7FB5] hover:text-[#1B3A5C] mb-4 transition-colors">
      <ArrowLeft :size="16" /><span>返回同学列表</span>
    </button>

    <div class="flex gap-4">
      <!-- 左侧：资料主卡 -->
      <div class="flex-1 space-y-4">
        <!-- 基本资料卡 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="flex items-start gap-4">
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              :class="store.isFriend(userId) ? 'bg-[#4CAF50]' : 'bg-[#4A7FB5]'"
            >{{ detail.name.charAt(0) }}</div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h2 class="text-xl font-serif text-[#1B3A5C]">{{ detail.name }}</h2>
                <span v-if="store.isFriend(userId)" class="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">好友</span>
                <span v-else-if="detail.status === 'pending_sent'" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">待确认</span>
                <span v-else-if="detail.status === 'pending_received'" class="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">待接受</span>
                <span v-else class="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">同学</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ detail.bio }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1"><GraduationCap :size="12" />{{ detail.className }}</span>
                <span class="flex items-center gap-1"><Calendar :size="12" />{{ detail.enrollYear }}级</span>
                <span class="flex items-center gap-1"><MapPin :size="12" />{{ detail.hometown }}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">最近活跃：{{ detail.lastActiveAt }}</div>

              <!-- 操作按钮 -->
              <div class="mt-3">
                <button
                  v-if="getStatusInfo()"
                  @click="getStatusInfo()?.action()"
                  class="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded transition-colors"
                  :class="getStatusInfo()?.class"
                >
                  <component :is="getStatusInfo()?.icon" :size="14" />
                  {{ getStatusInfo()?.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 共同好友 -->
        <div v-if="detail.mutualFriends.length > 0" class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-sm font-semibold text-[#1B3A5C] mb-3 flex items-center gap-2">
            <Users :size="14" /> 共同好友 ({{ detail.mutualFriends.length }})
          </h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="mf in detail.mutualFriends"
              :key="mf.id"
              class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-100"
              @click="router.push(`/classmate/${mf.id}`)"
            >
              <div class="w-7 h-7 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white text-xs font-medium">{{ mf.name.charAt(0) }}</div>
              <div>
                <div class="text-xs font-medium text-[#1B3A5C]">{{ mf.name }}</div>
                <div class="text-xs text-gray-400">{{ mf.className }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近动态 -->
        <div v-if="detail.recentFeeds.length > 0" class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-sm font-semibold text-[#1B3A5C] mb-3">最近动态</h3>
          <div class="space-y-3">
            <div
              v-for="feed in detail.recentFeeds"
              :key="feed.id"
              class="border-b border-gray-50 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
              @click="router.push(`/feed/${feed.id}`)"
            >
              <p class="text-sm text-gray-700">{{ feed.content }}</p>
              <div class="flex items-center gap-1.5 mt-1">
                <div v-for="photo in feed.photos.slice(0, 2)" :key="photo.id" class="w-14 h-10 rounded overflow-hidden border border-gray-200">
                  <img v-if="photo.canView" :src="photo.url" class="w-full h-full object-cover" loading="lazy" />
                  <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span class="text-xs text-gray-400">锁</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                <span class="flex items-center gap-1"><Heart :size="10" />{{ feed.likeCount }}</span>
                <span class="flex items-center gap-1"><MessageSquare :size="10" />{{ feed.commentCount }}</span>
                <span>{{ feed.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 照片 -->
        <div v-if="detail.userPhotos.length > 0" class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-sm font-semibold text-[#1B3A5C] mb-3">可见照片 ({{ detail.userPhotos.length }})</h3>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="photo in detail.userPhotos.slice(0, 8)"
              :key="photo.id"
              class="aspect-[4/3] rounded overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80"
              @click="router.push(`/photo/${photo.id}`)"
            >
              <img :src="photo.url" class="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：统计面板 -->
      <div class="hidden lg:block w-56 space-y-3">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h4 class="text-xs font-semibold text-[#1B3A5C] mb-3">资料统计</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">好友数</span>
              <span class="font-semibold text-[#1B3A5C]">{{ detail.userFriendCount }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">共同好友</span>
              <span class="font-semibold text-[#4A7FB5]">{{ detail.mutualFriends.length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">动态数</span>
              <span class="font-semibold text-[#1B3A5C]">{{ detail.recentFeeds.length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">可见照片</span>
              <span class="font-semibold text-[#1B3A5C]">{{ detail.userPhotos.length }}</span>
            </div>
          </div>
        </div>

        <!-- 好友状态卡 -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h4 class="text-xs font-semibold text-[#1B3A5C] mb-2">好友关系</h4>
          <div v-if="store.isFriend(userId)" class="text-xs">
            <span class="text-green-600">你们是好友</span>
            <p class="text-gray-400 mt-1">可以查看"仅好友"可见的照片和动态</p>
          </div>
          <div v-else-if="detail.status === 'pending_sent'" class="text-xs">
            <span class="text-gray-500">已发送好友申请</span>
            <p class="text-gray-400 mt-1">等待对方确认</p>
          </div>
          <div v-else-if="detail.status === 'pending_received'" class="text-xs">
            <span class="text-orange-600">对方申请加你为好友</span>
            <p class="text-gray-400 mt-1">接受后可查看好友内容</p>
          </div>
          <div v-else class="text-xs">
            <span class="text-gray-500">你们还不是好友</span>
            <p class="text-gray-400 mt-1">仅可查看公开内容</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-400 py-12">用户不存在</div>
</template>
