import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)

  // 解析token
  const parseToken = (token) => {
    try {
      // 分割token，获取payload部分
      const payload = token.split('.')[1]
      // 解码base64
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Token解析失败:', error)
      return null
    }
  }

  // 从localStorage恢复用户信息
  const restoreUserInfo = () => {
    const storedToken = localStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo')

    if (storedToken && storedUserInfo) {
      token.value = storedToken
      userInfo.value = JSON.parse(storedUserInfo)
    }
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    if (info?.token) {
      token.value = info.token
      localStorage.setItem('token', info.token)
      localStorage.setItem('userInfo', JSON.stringify(info))
    }
  }

  // 清除用户信息并退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  // 计算属性
  const isAdmin = computed(() => {
    const decoded = token.value ? parseToken(token.value) : null
    return decoded?.role === 'admin'
  })

  const isLoggedIn = computed(() => {
    return !!token.value && !!userInfo.value
  })

  return {
    token,
    userInfo,
    setUserInfo,
    logout,
    restoreUserInfo,
    isAdmin,
    isLoggedIn,
  }
})
