import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/award',
        },
        {
          path: 'award',
          name: 'award',
          component: () => import('@/views/award/index.vue'),
        },
        {
          path: 'team',
          name: 'team',
          component: () => import('@/views/team/index.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/index.vue'),
        },
        {
          path: 'competition',
          name: 'competition',
          component: () => import('@/views/competition/index.vue'),
        },
        {
          path: 'competition-level',
          name: 'competition-level',
          component: () => import('@/views/level/index.vue'),
        },
        {
          path: 'major',
          name: 'major',
          component: () => import('@/views/major/index.vue'),
        },
        {
          path: 'student',
          name: 'student',
          component: () => import('@/views/student/index.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/user/index.vue'),
          meta: { requiresAdmin: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  // 如果有token但没有用户信息，尝试恢复用户信息
  if (token && !userStore.userInfo) {
    userStore.restoreUserInfo()
  }

  // 如果用户已登录且要去登录页或注册页
  if (userStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    next('/award') // 重定向到获奖信息页面
    return
  }

  // 如果是前往登录页或注册页，直接放行
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 如果用户未登录且要去的不是登录页或注册页
  if (!userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 需要管理员权限的页面
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/award')
    return
  }

  next()
})

export default router
