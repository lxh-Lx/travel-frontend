import { defineStore } from 'pinia'
import api from '../api/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  actions: {
    // 使用后端真实登录接口获取 token 和用户信息
    async login(username, password) {
      const resp = await api.post('/user/login', { username, password })
      const token = resp.data?.token
      const user = resp.data?.userInfo || resp.data?.user || null
      if (!token) throw new Error('登录未返回 token')
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      if (user) localStorage.setItem('user', JSON.stringify(user))
    },

    // 调用后端注册接口
    async register(user) {
      const resp = await api.post('/user/register', user)
      return resp.data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    isLoggedIn() {
      return !!this.token
    }
  }
})

