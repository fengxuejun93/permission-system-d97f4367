<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSocialStore } from '@/stores/social'
import { Home, Users, Image, Bell } from 'lucide-vue-next'

const route = useRoute()
const store = useSocialStore()

const navItems = [
  { path: '/', label: '动态首页', icon: Home },
  { path: '/classmates', label: '同学/好友', icon: Users },
  { path: '/album', label: '我的相册', icon: Image },
]
</script>

<template>
  <nav class="fixed left-0 top-0 bottom-0 w-56 bg-[#1B3A5C] text-white flex flex-col z-50">
    <!-- Logo -->
    <div class="px-5 py-4 border-b border-white/10">
      <h1 class="text-xl font-serif tracking-wide">同学录</h1>
      <p class="text-xs text-blue-200 mt-1">{{ store.currentUser.name }} 的主页</p>
    </div>

    <!-- 导航项 -->
    <div class="flex-1 py-3">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors"
        :class="[
          route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))
            ? 'bg-white/15 text-white font-medium'
            : 'text-blue-100 hover:bg-white/5 hover:text-white'
        ]"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </router-link>

      <!-- 通知入口 -->
      <div class="mt-4 px-5">
        <div class="flex items-center gap-2 text-blue-200 text-xs uppercase tracking-wider mb-2">
          <Bell :size="14" />
          <span>通知</span>
        </div>
        <div v-if="store.pendingRequestCount > 0" class="bg-[#E8533F] text-white text-xs px-2 py-1 rounded">
          {{ store.pendingRequestCount }} 条好友请求待处理
        </div>
        <div v-else class="text-blue-300 text-xs">暂无新通知</div>
      </div>
    </div>

    <!-- 底部用户信息 -->
    <div class="px-5 py-3 border-t border-white/10">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-[#4A7FB5] flex items-center justify-center text-xs font-bold">
          {{ store.currentUser.name.charAt(0) }}
        </div>
        <div class="text-xs">
          <div class="text-white">{{ store.currentUser.name }}</div>
          <div class="text-blue-200">{{ store.currentUser.className }}</div>
        </div>
      </div>
    </div>
  </nav>
</template>
