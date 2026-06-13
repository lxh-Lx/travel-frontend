<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-icon">🔐</div>
        <h1 class="auth-title">欢迎回来</h1>
        <p class="auth-subtitle">登录到您的 TravelPlan 账户</p>
      </div>
      
      <form @submit.prevent="doLogin" class="auth-form">
        <div class="input-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              v-model="username" 
              placeholder="请输入用户名" 
              required
              autocomplete="username"
            />
          </div>
        </div>
        
        <div class="input-group">
          <label>密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              type="password" 
              v-model="password" 
              placeholder="请输入密码" 
              required
              autocomplete="current-password"
            />
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary btn-lg btn-block">
          <span class="btn-icon">🚀</span>
          登录
        </button>
      </form>
      
      <div class="auth-footer">
        <p>还没有账号？</p>
        <router-link to="/register" class="auth-link">
          立即注册
          <span class="link-arrow">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import router from '../router'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const auth = useAuthStore()

    const doLogin = async () => {
      try {
        await auth.login(username.value, password.value)
        router.push('/itineraries')
      } catch (e) {
        alert('登录失败：' + (e.response?.data?.message || e.message))
      }
    }

    return { username, password, doLogin }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 450px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  color: #718096;
  font-size: 1rem;
}

.auth-form {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
}

.input-wrapper .input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.input-wrapper input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.input-wrapper input::placeholder {
  color: #a0aec0;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.btn-icon {
  margin-right: 0.5rem;
}

.auth-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 2px solid #edf2f7;
}

.auth-footer p {
  color: #718096;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.auth-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.auth-link:hover {
  color: #764ba2;
  transform: translateX(3px);
}

.link-arrow {
  transition: transform 0.3s ease;
}

.auth-link:hover .link-arrow {
  transform: translateX(3px);
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .auth-icon {
    font-size: 3rem;
  }
}
</style>

