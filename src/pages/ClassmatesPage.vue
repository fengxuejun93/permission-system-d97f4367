<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSocialStore } from '@/stores/social'
import { Search, UserPlus, UserMinus, UserCheck, Clock } from 'lucide-vue-next'

const store = useSocialStore()
const searchKeyword = ref('')
const activeTab = ref<'all' | 'friends' | 'pending'>('all')

const filteredClassmates = computed(() => {
  const results = store.searchClassmates(searchKeyword.value)
  switch (activeTab.value) {
    case 'friends':
      return results.filter(u => store.isFriend(u.id))
    case 'pending':
      return results.filter(u => {
        const status = store.getFriendshipStatus(u.id)
        return status === 'pending_sent' || status === 'pending_received'
      })
    default:
      return results
  }
})

function getStatusInfo(userId: string) {
  const status = store.getFriendshipStatus(userId)
  switch (status) {
    case 'accepted':
      return { label: '已好友', class: 'bg-[#4CAF50] text-white', icon: UserCheck, action: () => store.removeFriend(userId) }
    case 'pending_sent':
      return { label: '待确认', class: 'bg-gray-200 text-gray-600', icon: Clock, action: () => store.removeFriend(userId) }
    case 'pending_received':
      return { label: '待接受', class: 'bg-[#E8533F] text-white', icon: Clock, action: () => store.acceptFriend(userId) }
    default:
      return { label: '加好友', class: 'bg-[#4A7FB5] text-white', icon: UserPlus, action: () => store.addFriend(userId) }
  }
}
</script>

<template>
  <div>
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F8A] rounded-lg p-6 mb-4 text-white">
      <h2 class="text-xl font-serif">同学 / 好友</h2>
      <p class="text-sm text-blue-200 mt-1">找到你的同学，建立好友关系</p>
    </div>

    <!-- 搜索栏 -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div class="relative">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索同学姓名或班级..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-[#4A7FB5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4A7FB5]"
        />
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="flex gap-1 mb-4">
      <button
        v-for="tab in [
          { key: 'all', label: '全部同学' },
          { key: 'friends', label: `好友 (${store.friendCount})` },
          { key: 'pending', label: `待处理 (${store.pendingReceived.length + store.pendingSent.length})` },
        ]"
        :key="tab.key"
        @click="activeTab = tab.key as any"
        class="px-3 py-1.5 text-xs rounded-lg transition-colors"
        :class="[
          activeTab === tab.key
            ? 'bg-[#1B3A5C] text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 同学列表 -->
    <div class="space-y-2">
      <div
        v-for="classmate in filteredClassmates"
        :key="classmate.id"
        class="bg-white rounded-lg shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            :class="store.isFriend(classmate.id) ? 'bg-[#4CAF50]' : 'bg-[#4A7FB5]'"
          >
            {{ classmate.name.charAt(0) }}
          </div>
          <div>
            <div class="text-sm font-semibold text-[#1B3A5C]">{{ classmate.name }}</div>
            <div class="text-xs text-gray-500">{{ classmate.className }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ classmate.bio }}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span
            class="text-xs px-2 py-0.5 rounded"
            :class="store.isFriend(classmate.id) ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'"
          >
            {{ store.isFriend(classmate.id) ? '好友' : '同学' }}
          </span>
          <button
            @click="getStatusInfo(classmate.id).action()"
            class="flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors"
            :class="getStatusInfo(classmate.id).class"
          >
            <component :is="getStatusInfo(classmate.id).icon" :size="12" />
            {{ getStatusInfo(classmate.id).label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredClassmates.length === 0" class="text-center text-gray-400 py-12">
      未找到匹配的同学
    </div>
  </div>
</template>
