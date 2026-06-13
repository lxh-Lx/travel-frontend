<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/itineraries" class="logo-link">
          <span class="logo-icon">✈️</span>
          <span class="logo-text">TravelPlan</span>
        </router-link>
      </div>
      
      <nav class="nav">
        <router-link to="/itineraries" class="nav-link">
          <span class="nav-icon">📋</span>
          我的行程
        </router-link>
        <router-link to="/itineraries/new" class="nav-link nav-link-primary">
          <span class="nav-icon">➕</span>
          新建行程
        </router-link>
      </nav>
      
      <div class="user-section">
        <template v-if="auth.isLoggedIn()">
          <router-link to="/profile" class="user-info">
            <div class="user-avatar">
              {{ auth.user?.username?.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ auth.user?.username }}</span>
          </router-link>
          <button @click="logout" class="btn btn-secondary btn-sm">
            <span class="btn-icon">🚪</span>
            退出登录
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-primary btn-sm">
            <span class="btn-icon">🔐</span>
            登录
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../stores/auth'
export default {
  setup() {
    const auth = useAuthStore()
    const logout = () => { auth.logout(); window.location.href = '/#/login' }
    return { auth, logout }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.75rem;
}

.logo-text {
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-weight: 600;
}

.nav-link-primary {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.nav-link-primary:hover {
  background: #f0f0f0;
  color: #5a67d8;
}

.nav-icon {
  font-size: 1.125rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-info:hover {
  background: rgba(255, 255, 255, 0.25);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

.btn-icon {
  margin-right: 0.375rem;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .logo-link {
    font-size: 1.25rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .nav {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }

  .user-info {
    padding: 0.375rem 0.75rem;
  }

  .user-avatar {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .user-name {
    font-size: 0.875rem;
  }
}
</style>

