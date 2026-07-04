import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import ClassmatesPage from '@/pages/ClassmatesPage.vue'
import FeedDetailPage from '@/pages/FeedDetailPage.vue'
import PhotoDetailPage from '@/pages/PhotoDetailPage.vue'
import ClassmateDetailPage from '@/pages/ClassmateDetailPage.vue'
import AlbumPage from '@/pages/AlbumPage.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'classmates', name: 'classmates', component: ClassmatesPage },
      { path: 'feed/:id', name: 'feed-detail', component: FeedDetailPage },
      { path: 'photo/:id', name: 'photo-detail', component: PhotoDetailPage },
      { path: 'classmate/:id', name: 'classmate-detail', component: ClassmateDetailPage },
      { path: 'album', name: 'album', component: AlbumPage },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
