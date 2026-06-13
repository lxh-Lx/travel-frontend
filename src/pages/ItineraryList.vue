<template>
  <div class="itinerary-list-page">
    <Header />
    <main class="main-content">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <span class="title-icon">📋</span>
            我的行程
          </h1>
          <p class="page-subtitle">管理和查看您的所有旅行计划</p>
        </div>
        <router-link to="/itineraries/new" class="btn btn-primary">
          <span class="btn-icon">➕</span>
          新建行程
        </router-link>
      </div>

      <!-- Search and Filter Bar -->
      <div v-if="!loading && list.length > 0" class="search-filter-bar">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            placeholder="搜索目的地、出发地..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>
        <select v-model="sortBy" class="filter-select">
          <option value="newest">最新创建</option>
          <option value="budget_high">预算从高到低</option>
          <option value="budget_low">预算从低到高</option>
          <option value="days_long">天数从多到少</option>
          <option value="days_short">天数从少到多</option>
        </select>
      </div>

      <div v-if="loading" class="loading">
        <span>加载中...</span>
      </div>

      <div v-else-if="filteredList.length === 0 && list.length > 0" class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-text">未找到匹配的行程</h3>
        <p class="empty-state-description">尝试修改搜索条件</p>
        <button @click="searchQuery = ''; sortBy = 'newest'" class="btn btn-secondary">
          清除筛选
        </button>
      </div>

      <div v-else-if="list.length === 0" class="empty-state">
        <div class="empty-state-icon">🗺️</div>
        <h3 class="empty-state-text">暂无行程</h3>
        <p class="empty-state-description">开始创建您的第一个旅行计划吧！</p>
        <router-link to="/itineraries/new" class="btn btn-primary btn-lg">
          <span class="btn-icon">✈️</span>
          创建行程
        </router-link>
      </div>

      <div v-else class="itinerary-grid">
        <div
          v-for="it in filteredList"
          :key="it.id"
          class="itinerary-card"
        >
          <div class="card-header">
            <div class="destination-info">
              <div class="destination-icon">📍</div>
              <div>
                <h3 class="destination-name">{{ it.destination }}</h3>
                <p class="trip-duration">{{ it.days }} 天行程</p>
              </div>
            </div>
            <div class="budget-badge">
              <span class="badge badge-primary">¥{{ it.budget }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="trip-details">
              <div class="detail-item">
                <span class="detail-icon">🚀</span>
                <span class="detail-label">出发地</span>
                <span class="detail-value">{{ it.startPlace }}</span>
              </div>
              <div v-if="it.interest" class="detail-item">
                <span class="detail-icon">❤️</span>
                <span class="detail-label">偏好</span>
                <span class="detail-value">{{ it.interest }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <router-link 
              :to="`/itineraries/${it.id}`" 
              class="btn btn-secondary btn-sm"
            >
              <span class="btn-icon">👁️</span>
              查看详情
            </router-link>
            <router-link 
              :to="`/itineraries/${it.id}/edit`" 
              class="btn btn-secondary btn-sm"
            >
              <span class="btn-icon">✏️</span>
              编辑
            </router-link>
            <button 
              @click="del(it.id)" 
              class="btn btn-danger btn-sm"
            >
              <span class="btn-icon">🗑️</span>
              删除
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api'
import Header from '../components/Header.vue'

export default {
  components: { Header },
  setup() {
    const list = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const sortBy = ref('newest')

    const fetch = async () => {
      loading.value = true
      try {
        const resp = await api.get('/itinerary/my')
        list.value = resp.data
      } catch (e) {
        console.error(e)
        alert('获取行程失败')
      } finally { loading.value = false }
    }

    const del = async (id) => {
      if (!confirm('确认删除？')) return
      await api.delete(`/itinerary/${id}`)
      fetch()
    }

    const filteredList = computed(() => {
      let result = [...list.value]

      // Search filter
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        result = result.filter(it =>
          (it.destination && it.destination.toLowerCase().includes(q)) ||
          (it.startPlace && it.startPlace.toLowerCase().includes(q))
        )
      }

      // Sort
      switch (sortBy.value) {
        case 'budget_high':
          result.sort((a, b) => (b.budget || 0) - (a.budget || 0))
          break
        case 'budget_low':
          result.sort((a, b) => (a.budget || 0) - (b.budget || 0))
          break
        case 'days_long':
          result.sort((a, b) => (b.days || 0) - (a.days || 0))
          break
        case 'days_short':
          result.sort((a, b) => (a.days || 0) - (b.days || 0))
          break
        case 'newest':
        default:
          result.sort((a, b) => (b.id || 0) - (a.id || 0))
          break
      }

      return result
    })

    onMounted(fetch)
    return { list, loading, del, searchQuery, sortBy, filteredList }
  }
}
</script>

<style scoped>
.itinerary-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 2rem;
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 1rem;
}

/* Search & Filter Bar */
.search-filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.search-wrapper {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.1rem;
  z-index: 1;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.85rem 2.5rem 0.85rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}
.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
  outline: none;
}
.clear-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}
.clear-btn:hover { color: #4a5568; }
.filter-select {
  padding: 0.85rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  min-width: 160px;
  transition: all 0.3s ease;
}
.filter-select:focus {
  border-color: #667eea;
  outline: none;
}

.btn-icon {
  margin-right: 0.375rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.125rem;
}

.loading::after {
  content: '';
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 0.75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-state-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.empty-state-description {
  color: #718096;
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
}

.itinerary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.itinerary-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.itinerary-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 2px solid #edf2f7;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.destination-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.destination-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.destination-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
}

.trip-duration {
  color: #718096;
  font-size: 0.875rem;
  margin: 0;
}

.budget-badge {
  flex-shrink: 0;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.detail-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.detail-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
}

.detail-value {
  color: #1a202c;
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
  text-align: right;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #edf2f7;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.card-footer .btn {
  flex: 1;
  min-width: 100px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .page-title {
    justify-content: center;
  }

  .itinerary-grid {
    grid-template-columns: 1fr;
  }

  .card-footer {
    flex-direction: column;
  }

  .card-footer .btn {
    width: 100%;
  }
}
</style>

