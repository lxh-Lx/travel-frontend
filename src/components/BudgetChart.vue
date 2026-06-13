<template>
  <div class="budget-section" v-if="budget">
    <div class="section-header">
      <span class="section-icon">💰</span>
      <h2 class="section-title">预算明细</h2>
    </div>

    <div class="budget-chart">
      <div class="budget-item" v-for="(item, key) in budgetItems" :key="key">
        <div class="budget-label">
          <span class="budget-icon">{{ item.icon }}</span>
          <span class="budget-name">{{ item.label }}</span>
        </div>
        <div class="budget-bar-wrapper">
          <div
            class="budget-bar"
            :style="{ width: item.percent + '%', background: item.color }"
          ></div>
        </div>
        <span class="budget-value">¥{{ item.value }}</span>
      </div>
    </div>

    <div class="budget-total">
      <span>总预算</span>
      <span class="total-amount">¥{{ totalBudget }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    budget: { type: Object, default: null }
  },
  computed: {
    budgetItems() {
      if (!this.budget) return []
      const items = [
        { key: 'transport', label: '交通', icon: '🚗', color: '#3b82f6' },
        { key: 'hotel', label: '住宿', icon: '🏨', color: '#f59e0b' },
        { key: 'food', label: '餐饮', icon: '🍽️', color: '#ef4444' },
        { key: 'tickets', label: '门票', icon: '🎫', color: '#8b5cf6' },
        { key: 'shopping', label: '购物', icon: '🛍️', color: '#ec4899' },
        { key: 'other', label: '其他', icon: '📦', color: '#6b7280' },
      ]
      const maxVal = Math.max(...items.map(i => this.budget[i.key] || 0), 1)
      return items.map(i => ({
        ...i,
        value: this.budget[i.key] || 0,
        percent: Math.round(((this.budget[i.key] || 0) / maxVal) * 100)
      })).filter(i => i.value > 0)
    },
    totalBudget() {
      if (!this.budget) return 0
      return Object.values(this.budget).reduce((sum, v) => sum + (Number(v) || 0), 0)
    }
  }
}
</script>

<style scoped>
.budget-section {
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
.budget-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.budget-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.budget-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 70px;
  flex-shrink: 0;
}
.budget-icon { font-size: 1.25rem; }
.budget-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}
.budget-bar-wrapper {
  flex: 1;
  height: 10px;
  background: #f3f4f6;
  border-radius: 5px;
  overflow: hidden;
}
.budget-bar {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
  min-width: 4px;
}
.budget-value {
  width: 80px;
  text-align: right;
  font-weight: 600;
  color: #1a202c;
  font-size: 0.95rem;
}
.budget-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
  font-weight: 600;
  color: #4a5568;
}
.total-amount {
  font-size: 1.25rem;
  color: #667eea;
  font-weight: 700;
}
</style>
