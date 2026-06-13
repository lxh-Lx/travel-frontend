<template>
  <div class="hotels-section" v-if="hotels && hotels.hotels && hotels.hotels.length">
    <div class="section-header">
      <span class="section-icon">🏨</span>
      <h2 class="section-title">推荐住宿</h2>
      <span class="section-count">{{ hotels.count }} 家酒店</span>
    </div>

    <div class="hotels-grid">
      <div v-for="(hotel, index) in hotels.hotels" :key="index" class="hotel-card">
        <div class="hotel-icon">🏩</div>
        <div class="hotel-info">
          <h3 class="hotel-name">{{ hotel.name }}</h3>
          <p class="hotel-address">📍 {{ hotel.address }}</p>
          <p v-if="hotel.rating" class="hotel-rating">⭐ {{ hotel.rating }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hotels: { type: Object, default: null }
  }
}
</script>

<style scoped>
.hotels-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #edf2f7;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.section-icon { font-size: 2rem; }
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}
.section-count {
  margin-left: auto;
  color: #718096;
  font-size: 0.9rem;
}
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.hotel-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%);
  border-radius: 0.75rem;
  border: 2px solid rgba(234, 179, 8, 0.2);
  transition: all 0.3s ease;
}
.hotel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.hotel-icon { font-size: 2rem; flex-shrink: 0; }
.hotel-info { flex: 1; }
.hotel-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}
.hotel-address {
  color: #4a5568;
  font-size: 0.85rem;
  margin: 0 0 0.25rem 0;
}
.hotel-rating {
  color: #f59e0b;
  font-size: 0.85rem;
  font-weight: 500;
}
@media (max-width: 768px) {
  .hotels-grid { grid-template-columns: 1fr; }
}
</style>
