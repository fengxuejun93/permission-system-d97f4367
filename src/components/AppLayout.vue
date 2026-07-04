<script setup lang="ts">
import SideNav from '@/components/SideNav.vue'
import StatsPanel from '@/components/StatsPanel.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- 左侧导航 -->
    <SideNav />

    <!-- 主内容区 -->
    <main class="flex-1 ml-56 p-4">
      <div class="max-w-4xl mx-auto">
        <router-view />
      </div>
    </main>

    <!-- 右侧统计面板 -->
    <aside class="hidden lg:block w-64 p-4 pt-6">
      <StatsPanel />
    </aside>
  </div>
</template>
