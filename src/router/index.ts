import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login'}
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  await auth.initSession()

  if (to.meta.requiresAuth && !auth.isAuthenticated && to.name !== 'login') {
    return { name: 'login', query: {redirect: to.fullPath} }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

router.afterEach((to) => {
  if (typeof window === 'undefined') return

  const APP_NAME = 'qBittorrent'
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${APP_NAME}`
  }
})

export default router
