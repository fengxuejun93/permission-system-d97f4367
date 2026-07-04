<script setup lang="ts">
import { useSocialStore } from '@/stores/social'
import { Users, Clock, Image, MessageSquare, Heart } from 'lucide-vue-next'

const store = useSocialStore()
</script>

<template>
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-[#1B3A5C] border-b border-gray-200 pb-2">数据统计</h3>

    <div class="bg-white rounded-lg shadow-sm p-3 space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Users :size="16" class="text-[#4A7FB5]" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#1B3A5C]">{{ store.friendCount }}</div>
          <div class="text-xs text-gray-500">好友数</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
          <Clock :size="16" class="text-[#E8533F]" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#E8533F]">{{ store.pendingRequestCount }}</div>
          <div class="text-xs text-gray-500">待处理请求</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <Image :size="16" class="text-[#4CAF50]" />
        </div>
        <div>
          <div class="text-lg font-bold text-[#4CAF50]">{{ store.publicPhotoCount }}</div>
          <div class="text-xs text-gray-500">公开照片数</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <MessageSquare :size="16" class="text-purple-500" />
        </div>
        <div>
          <div class="text-lg font-bold text-purple-600">{{ store.totalCommentCount }}</div>
          <div class="text-xs text-gray-500">评论/回复数</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
          <Heart :size="16" class="text-red-500" />
        </div>
        <div>
          <div class="text-lg font-bold text-red-500">{{ store.totalLikeCount }}</div>
          <div class="text-xs text-gray-500">获得点赞</div>
        </div>
      </div>
    </div>

    <!-- 好友列表快览 -->
    <div class="bg-white rounded-lg shadow-sm p-3">
      <h4 class="text-xs font-semibold text-[#1B3A5C] mb-2">我的好友 ({{ store.friendCount }})</h4>
      <div class="flex flex-wrap gap-1.5">
        <router-link
          v-for="friend in store.friendList"
          :key="friend.id"
          :to="`/classmate/${friend.id}`"
          class="w-8 h-8 rounded-full bg-[#4A7FB5] flex items-center justify-center text-white text-xs font-medium hover:opacity-80"
          :title="friend.name"
        >
          {{ friend.name.charAt(0) }}
        </router-link>
      </div>
    </div>

    <!-- 待处理请求快览 -->
    <div v-if="store.pendingReceived.length > 0" class="bg-white rounded-lg shadow-sm p-3">
      <h4 class="text-xs font-semibold text-[#E8533F] mb-2">待处理请求</h4>
      <div class="space-y-2">
        <div
          v-for="req in store.pendingReceived"
          :key="req.id"
          class="flex items-center justify-between"
        >
          <router-link :to="`/classmate/${req.id}`" class="flex items-center gap-2 hover:opacity-80">
            <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs text-orange-600">
              {{ req.name.charAt(0) }}
            </div>
            <span class="text-xs text-gray-700">{{ req.name }}</span>
          </router-link>
          <div class="flex gap-1">
            <button
              @click="store.acceptFriend(req.id)"
              class="text-xs px-2 py-0.5 bg-[#4CAF50] text-white rounded hover:bg-green-600"
            >
              接受
            </button>
            <button
              @click="store.removeFriend(req.id)"
              class="text-xs px-2 py-0.5 border border-gray-300 text-gray-500 rounded hover:bg-gray-50"
            >
              拒绝
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
