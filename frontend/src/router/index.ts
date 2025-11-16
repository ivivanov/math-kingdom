import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/realm/number-village',
      name: 'number-village',
      component: () => import('@/views/RealmView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/quest/:questId',
      name: 'quest',
      component: () => import('@/views/QuestView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/avatar',
      name: 'avatar',
      component: () => import('@/views/AvatarCustomizationView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/room',
      name: 'room',
      component: () => import('@/views/RoomDecorationView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router

