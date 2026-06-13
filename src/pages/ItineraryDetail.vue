<template>
  <div class="itinerary-detail-page">
    <Header />
    <main class="main-content">
      <div v-if="loading" class="loading">
        <span>加载行程详情中...</span>
      </div>

      <div v-else-if="itinerary" class="detail-container">
        <div class="detail-header">
          <button @click="$router.push('/itineraries')" class="back-button">
            <span class="back-icon">←</span>
            返回行程列表
          </button>
          
          <div class="header-content">
            <div class="destination-badge">
              <span class="badge-icon">📍</span>
              {{ itinerary.destination }}
            </div>
            <h1 class="detail-title">{{ itinerary.destination }} — {{ itinerary.days }} 天精彩旅程</h1>
            <div class="trip-meta">
              <div class="meta-item">
                <span class="meta-icon">🚀</span>
                <span class="meta-label">出发地</span>
                <span class="meta-value">{{ itinerary.startPlace }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">💰</span>
                <span class="meta-label">预算</span>
                <span class="meta-value">¥{{ itinerary.budget }}</span>
              </div>
              <div v-if="itinerary.interest" class="meta-item">
                <span class="meta-icon">❤️</span>
                <span class="meta-label">偏好</span>
                <span class="meta-value">{{ itinerary.interest }}</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <router-link 
              :to="`/itineraries/${itinerary.id}/edit`" 
              class="btn btn-secondary"
            >
              <span class="btn-icon">✏️</span>
              编辑行程
            </router-link>
          </div>
        </div>

        <div class="detail-body" v-if="parsedContent">
          <div class="summary-card">
            <div class="summary-icon">🌟</div>
            <div class="summary-content">
              <h3 class="summary-title">行程概述</h3>
              <p class="summary-text">{{ parsedContent.itinerary?.summary || '暂无行程概述' }}</p>
              <div class="summary-meta">
                <span class="summary-item">📅 {{ parsedContent.generateTime }}</span>
              </div>
            </div>
          </div>

          <WeatherCard :weather="parsedContent.weather" />

          <div class="days-section">
            <div class="section-header">
              <div class="section-icon">📅</div>
              <h2 class="section-title">每日行程安排</h2>
            </div>

            <div class="days-grid">
              <div
                v-for="(day, dayNum) in parsedContent.itinerary?.days"
                :key="dayNum"
                class="day-card"
              >
                <div class="day-header">
                  <div class="day-number">{{ dayNum }}</div>
                  <div class="day-title">{{ day.title }}</div>
                </div>

                <div class="day-body">
                  <div v-if="day.morning" class="time-block">
                    <div class="time-icon">🌅</div>
                    <div class="time-content">
                      <span class="time-label">上午</span>
                      <span class="time-text">{{ day.morning.replace('上午：', '') }}</span>
                    </div>
                  </div>

                  <div v-if="day.afternoon" class="time-block">
                    <div class="time-icon">☀️</div>
                    <div class="time-content">
                      <span class="time-label">下午</span>
                      <span class="time-text">{{ day.afternoon.replace('下午：', '') }}</span>
                    </div>
                  </div>

                  <div v-if="day.evening" class="time-block">
                    <div class="time-icon">🌙</div>
                    <div class="time-content">
                      <span class="time-label">晚上</span>
                      <span class="time-text">{{ day.evening.replace('晚上：', '') }}</span>
                    </div>
                  </div>

                  <div v-if="day.accommodation" class="time-block accommodation">
                    <div class="time-icon">🏨</div>
                    <div class="time-content">
                      <span class="time-label">住宿</span>
                      <span class="time-text">{{ day.accommodation.replace('入住', '') }}</span>
                    </div>
                  </div>

                  <div v-if="day.food" class="time-block food-block">
                    <div class="time-icon">🍽️</div>
                    <div class="time-content">
                      <span class="time-label">推荐美食</span>
                      <span class="time-text">{{ day.food.replace('推荐美食：', '') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BudgetChart :budget="parsedContent.itinerary?.budgetBreakdown" />

          <HotelCard :hotels="parsedContent.hotels" />

          <TravelTips :tips="parsedContent.itinerary?.tips" />

          <div v-if="parsedContent.scenicSpots?.spots?.length" class="spots-section">
            <div class="section-header">
              <div class="section-icon">🏛️</div>
              <h2 class="section-title">推荐景点</h2>
              <span class="section-count">共 {{ parsedContent.scenicSpots.count }} 个景点</span>
            </div>
            
            <div class="spots-grid">
              <div 
                v-for="(spot, index) in parsedContent.scenicSpots.spots" 
                :key="index" 
                class="spot-card"
              >
                <div class="spot-icon">📍</div>
                <div class="spot-content">
                  <h3 class="spot-name">{{ spot.name }}</h3>
                  <p class="spot-address">{{ spot.address }}</p>
                  <span class="spot-type">{{ spot.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="detail-body">
          <div class="empty-content">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">暂无行程安排</h3>
            <p class="empty-description">该行程尚未生成详细安排</p>
            <router-link :to="`/itineraries/${itinerary.id}/edit`" class="btn btn-primary">
              <span class="btn-icon">✏️</span>
              编辑行程
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">😕</div>
        <h3 class="empty-title">未找到行程</h3>
        <p class="empty-description">该行程可能已被删除或不存在</p>
        <router-link to="/itineraries" class="btn btn-primary">
          <span class="btn-icon">📋</span>
          查看所有行程
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api'
import Header from '../components/Header.vue'
import WeatherCard from '../components/WeatherCard.vue'
import HotelCard from '../components/HotelCard.vue'
import BudgetChart from '../components/BudgetChart.vue'
import TravelTips from '../components/TravelTips.vue'
import { useRoute } from 'vue-router'

export default {
  components: { Header, WeatherCard, HotelCard, BudgetChart, TravelTips },
  setup() {
    const route = useRoute()
    const id = route.params.id
    const itinerary = ref(null)
    const loading = ref(false)

    const fetch = async () => {
      loading.value = true
      try {
        const resp = await api.get(`/itinerary/${id}`)
        itinerary.value = resp.data
      } catch (e) {
        console.error(e)
      } finally { loading.value = false }
    }

    const parsedContent = computed(() => {
      if (!itinerary.value || !itinerary.value.content) return null
      try {
        return typeof itinerary.value.content === 'string' 
          ? JSON.parse(itinerary.value.content) 
          : itinerary.value.content
      } catch (e) {
        return null
      }
    })

    onMounted(fetch)
    return { itinerary, loading, parsedContent }
  }
}
</script>

<style scoped>
.itinerary-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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

.detail-container {
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

.detail-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.back-button:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  color: #2d3748;
  transform: translateX(-3px);
}

.back-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

.header-content {
  margin-bottom: 1.5rem;
}

.destination-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 2rem;
  color: #667eea;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.badge-icon {
  font-size: 1.25rem;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trip-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.meta-icon {
  font-size: 1.25rem;
}

.meta-label {
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
}

.meta-value {
  color: #1a202c;
  font-size: 0.95rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-icon {
  margin-right: 0.375rem;
}

.detail-body {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-bottom: 2rem;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #edf2f7;
}

.section-icon {
  font-size: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.summary-card {
  display: flex;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.summary-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
}

.summary-text {
  color: #4a5568;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.summary-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.summary-item {
  color: #718096;
  font-size: 0.9rem;
}

.days-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #edf2f7;
}

.section-icon {
  font-size: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.day-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #edf2f7;
}

.day-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.day-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.day-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
}

.day-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
}

.day-body {
  padding: 1.25rem 1.5rem;
}

.time-block {
  display: flex;
  gap: 1rem;
  padding: 0.875rem;
  background: #f7fafc;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.time-block:hover {
  background: #edf2f7;
}

.time-block.accommodation {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(66, 153, 225, 0.1) 100%);
}
.time-block.food-block {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%);
}

.time-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.time-content {
  flex: 1;
}

.time-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.time-text {
  color: #1a202c;
  font-size: 0.95rem;
  line-height: 1.5;
}

.spots-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #edf2f7;
}

.spots-section .section-header {
  align-items: center;
  justify-content: space-between;
}

.section-count {
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
}

.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.spot-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(66, 153, 225, 0.1) 100%);
  border-radius: 0.75rem;
  border: 2px solid rgba(72, 187, 120, 0.2);
  transition: all 0.3s ease;
}

.spot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(72, 187, 120, 0.4);
}

.spot-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.spot-content {
  flex: 1;
}

.spot-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.spot-address {
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.spot-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(72, 187, 120, 0.15);
  color: #48bb78;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.empty-content {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-content .empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-content .empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.empty-content .empty-description {
  color: #718096;
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.empty-description {
  color: #718096;
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.5rem;
  }

  .detail-header {
    padding: 1.5rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .trip-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .meta-item {
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions .btn {
    width: 100%;
  }

  .detail-body {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .summary-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .summary-meta {
    justify-content: center;
  }

  .days-grid {
    grid-template-columns: 1fr;
  }

  .day-header {
    padding: 1rem;
  }

  .day-number {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  .day-title {
    font-size: 1rem;
  }

  .day-body {
    padding: 1rem;
  }

  .time-block {
    padding: 0.75rem;
  }

  .spots-grid {
    grid-template-columns: 1fr;
  }

  .spot-card {
    padding: 1rem;
  }
}
</style>

