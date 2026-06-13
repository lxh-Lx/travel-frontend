<template>
  <div class="weather-section" v-if="weather && weather.forecasts && weather.forecasts.length">
    <div class="section-header">
      <span class="section-icon">🌤️</span>
      <h2 class="section-title">天气预报</h2>
      <span class="section-sub">{{ weather.city }}</span>
    </div>

    <div class="weather-scroll">
      <div v-for="(day, index) in weather.forecasts" :key="index" class="weather-card">
        <div class="weather-date">
          <span class="date-text">{{ day.date }}</span>
          <span class="week-text">{{ day.week }}</span>
        </div>
        <div class="weather-info">
          <div class="weather-icon">{{ getWeatherIcon(day.dayWeather) }}</div>
          <div class="weather-desc">{{ day.dayWeather }}</div>
        </div>
        <div class="weather-temp">
          <span class="temp-high">{{ day.dayTemp }}°</span>
          <span class="temp-low">{{ day.nightTemp }}°</span>
        </div>
        <div class="weather-wind">
          {{ day.dayWind }} {{ day.dayPower }}级
        </div>
        <div v-if="day.dressAdvice" class="dress-advice">
          💡 {{ day.dressAdvice }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    weather: { type: Object, default: null }
  },
  methods: {
    getWeatherIcon(weather) {
      if (!weather) return '🌤️'
      if (weather.includes('晴')) return '☀️'
      if (weather.includes('云') || weather.includes('阴')) return '⛅'
      if (weather.includes('雨')) return '🌧️'
      if (weather.includes('雪')) return '❄️'
      if (weather.includes('风')) return '💨'
      if (weather.includes('雾') || weather.includes('霾')) return '🌫️'
      return '🌤️'
    }
  }
}
</script>

<style scoped>
.weather-section {
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
.section-icon { font-size: 2rem; }
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}
.section-sub {
  color: #718096;
  font-size: 0.9rem;
  margin-left: auto;
}
.weather-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.weather-card {
  min-width: 160px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  border-radius: 1rem;
  padding: 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
}
.weather-date {
  text-align: center;
  margin-bottom: 0.75rem;
}
.date-text {
  display: block;
  font-weight: 600;
  color: #1e40af;
  font-size: 0.9rem;
}
.week-text {
  font-size: 0.75rem;
  color: #6b7280;
}
.weather-info {
  text-align: center;
  margin-bottom: 0.5rem;
}
.weather-icon { font-size: 2rem; }
.weather-desc {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}
.weather-temp {
  text-align: center;
  margin-bottom: 0.5rem;
}
.temp-high {
  font-size: 1.25rem;
  font-weight: 700;
  color: #dc2626;
}
.temp-low {
  font-size: 0.9rem;
  color: #6b7280;
  margin-left: 0.5rem;
}
.weather-wind {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}
.dress-advice {
  font-size: 0.7rem;
  color: #4b5563;
  background: rgba(255,255,255,0.6);
  padding: 0.4rem;
  border-radius: 0.4rem;
  line-height: 1.3;
}
@media (max-width: 768px) {
  .weather-card { min-width: 140px; }
}
</style>
