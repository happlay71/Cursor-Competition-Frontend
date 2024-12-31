import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    console.log('Current token:', token) // 调试用

    if (token) {
      // 确保 headers 对象存在
      config.headers = config.headers || {}
      // 使用 token 头，而不是 Authorization
      config.headers.token = token
      console.log('Request headers:', config.headers) // 调试用
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 0) {
      return res
    }

    // token 错误或过期
    if (res.code === 40100) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.replace('/login')
      return Promise.reject(new Error('token 验证失败'))
    }

    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('请求错误:', error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.replace('/login')
          break
        default:
          ElMessage.error('请求失败')
      }
    }
    return Promise.reject(error)
  },
)

export default request
