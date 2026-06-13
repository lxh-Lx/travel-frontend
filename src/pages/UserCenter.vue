<template>
  <div class="user-center-page">
    <Header />
    <main class="main-content">
      <div class="page-container">
        <div class="page-card">
          <div class="card-header">
            <div class="header-icon">👤</div>
            <h1 class="header-title">个人中心</h1>
            <p class="header-subtitle">管理您的账户信息</p>
          </div>

          <!-- Profile Section -->
          <div class="profile-section">
            <div class="section-label">
              <span class="label-icon">📋</span>
              <span>基本信息</span>
            </div>

            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-row">
                <div class="input-group">
                  <label>用户名</label>
                  <input v-model="profile.username" placeholder="用户名" required />
                </div>
                <div class="input-group">
                  <label>手机号</label>
                  <input v-model="profile.phone" placeholder="手机号（选填）" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                <span class="btn-icon">💾</span>
                保存修改
              </button>
              <span v-if="profileMsg" class="msg" :class="profileOk ? 'msg-success' : 'msg-error'">
                {{ profileMsg }}
              </span>
            </form>
          </div>

          <!-- Password Section -->
          <div class="password-section">
            <div class="section-label">
              <span class="label-icon">🔒</span>
              <span>修改密码</span>
            </div>

            <form @submit.prevent="changePassword" class="password-form">
              <div class="input-group">
                <label>原密码</label>
                <input type="password" v-model="pwd.oldPassword" placeholder="请输入原密码" required />
              </div>
              <div class="input-group">
                <label>新密码</label>
                <input type="password" v-model="pwd.newPassword" placeholder="请输入新密码（至少6位）" required minlength="6" />
              </div>
              <div class="input-group">
                <label>确认新密码</label>
                <input type="password" v-model="pwd.confirmPassword" placeholder="请再次输入新密码" required />
              </div>
              <button type="submit" class="btn btn-primary">
                <span class="btn-icon">🔐</span>
                修改密码
              </button>
              <span v-if="pwdMsg" class="msg" :class="pwdOk ? 'msg-success' : 'msg-error'">
                {{ pwdMsg }}
              </span>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../api/api'
import Header from '../components/Header.vue'

export default {
  components: { Header },
  setup() {
    const auth = useAuthStore()

    const profile = ref({ username: '', phone: '' })
    const profileMsg = ref('')
    const profileOk = ref(true)

    const pwd = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
    const pwdMsg = ref('')
    const pwdOk = ref(true)

    const loadProfile = async () => {
      try {
        const resp = await api.get('/user/profile')
        profile.value.username = resp.data.username || ''
        profile.value.phone = resp.data.phone || ''
      } catch (e) {
        profileMsg.value = '加载用户信息失败'
        profileOk.value = false
      }
    }

    const updateProfile = async () => {
      profileMsg.value = ''
      try {
        const resp = await api.put('/user/profile', {
          username: profile.value.username,
          phone: profile.value.phone
        })
        profileOk.value = true
        profileMsg.value = resp.data.message || '更新成功'
        // Update local user info
        if (resp.data.userInfo) {
          auth.user = resp.data.userInfo
          localStorage.setItem('user', JSON.stringify(resp.data.userInfo))
        }
      } catch (e) {
        profileOk.value = false
        profileMsg.value = e.response?.data?.message || '更新失败'
      }
    }

    const changePassword = async () => {
      pwdMsg.value = ''
      if (pwd.value.newPassword !== pwd.value.confirmPassword) {
        pwdOk.value = false
        pwdMsg.value = '两次输入的新密码不一致'
        return
      }
      if (pwd.value.newPassword.length < 6) {
        pwdOk.value = false
        pwdMsg.value = '新密码不能少于6位'
        return
      }
      try {
        const resp = await api.put('/user/password', {
          oldPassword: pwd.value.oldPassword,
          newPassword: pwd.value.newPassword
        })
        pwdOk.value = true
        pwdMsg.value = resp.data.message || '密码修改成功'
        pwd.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      } catch (e) {
        pwdOk.value = false
        pwdMsg.value = e.response?.data?.message || '修改失败'
      }
    }

    onMounted(loadProfile)

    return { profile, profileMsg, profileOk, updateProfile, pwd, pwdMsg, pwdOk, changePassword }
  }
}
</script>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.main-content {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.page-container {
  animation: slideUp 0.5s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  overflow: hidden;
}
.card-header {
  text-align: center;
  padding: 2.5rem 2rem 2rem;
  background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
  border-bottom: 2px solid #edf2f7;
}
.header-icon { font-size: 3.5rem; margin-bottom: 0.75rem; }
.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}
.header-subtitle { color: #718096; margin: 0; font-size: 1rem; }

.profile-section, .password-section {
  padding: 2rem;
}
.password-section {
  border-top: 2px solid #edf2f7;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
}
.label-icon { font-size: 1.25rem; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}
.input-group {
  margin-bottom: 1rem;
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}
.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
}
.input-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
  background: white;
  outline: none;
}
.btn-icon { margin-right: 0.375rem; }
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.4);
}
.msg {
  display: inline-block;
  margin-left: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}
.msg-success { color: #10b981; }
.msg-error { color: #ef4444; }

@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; }
  .profile-section, .password-section { padding: 1.5rem; }
}
</style>
