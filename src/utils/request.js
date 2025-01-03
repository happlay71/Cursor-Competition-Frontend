import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '',
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      // 如果是 token 过期的错误
      if (res.code === 40100 || res.message?.includes('Token过期')) {
        // 清除过期的 token
        localStorage.removeItem('token')
        // 跳转到登录页
        window.location.href = '/login'
        return Promise.reject(new Error('Token已过期，请重新登录'))
      }
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    console.error('响应错误:', error)
    // 如果是 token 相关的错误
    if (error.response?.status === 401 || error.message?.includes('Token')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error('Token已过期，请重新登录'))
    }
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  },
)

export default service
