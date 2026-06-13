import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// 在请求时从 localStorage 获取 token，避免 Pinia 初始化顺序问题
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, err => Promise.reject(err))

// 全局响应处理，遇到 401 清理 token 并跳转登录
api.interceptors.response.use(resp => resp, err => {
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/#/login'
  }
  return Promise.reject(err)
})

export default api

