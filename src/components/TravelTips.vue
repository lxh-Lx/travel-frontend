<template>
  <div class="tips-section" v-if="hasTips">
    <div class="section-header">
      <span class="section-icon">💡</span>
      <h2 class="section-title">旅行贴士</h2>
    </div>

    <div class="tips-grid">
      <div v-if="tips.visa" class="tip-card">
        <div class="tip-icon">🛂</div>
        <div class="tip-content">
          <h4 class="tip-title">签证/证件</h4>
          <p class="tip-text">{{ tips.visa }}</p>
        </div>
      </div>

      <div v-if="tips.customs" class="tip-card">
        <div class="tip-icon">🎎</div>
        <div class="tip-content">
          <h4 class="tip-title">当地习俗</h4>
          <p class="tip-text">{{ tips.customs }}</p>
        </div>
      </div>

      <div v-if="tips.transport" class="tip-card">
        <div class="tip-icon">🚇</div>
        <div class="tip-content">
          <h4 class="tip-title">交通建议</h4>
          <p class="tip-text">{{ tips.transport }}</p>
        </div>
      </div>

      <div v-if="tips.packing && tips.packing.length" class="tip-card">
        <div class="tip-icon">🎒</div>
        <div class="tip-content">
          <h4 class="tip-title">必备物品</h4>
          <div class="packing-list">
            <span v-for="(item, i) in packingItems" :key="i" class="packing-tag">
              {{ item }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="tips.general" class="tip-card tip-general">
        <div class="tip-icon">📝</div>
        <div class="tip-content">
          <h4 class="tip-title">温馨提示</h4>
          <p class="tip-text">{{ tips.general }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tips: { type: Object, default: null }
  },
  computed: {
    hasTips() {
      if (!this.tips) return false
      return !!(this.tips.visa || this.tips.customs || this.tips.transport ||
                this.tips.general || (this.tips.packing && this.tips.packing.length))
    },
    packingItems() {
      if (!this.tips || !this.tips.packing) return []
      if (Array.isArray(this.tips.packing)) return this.tips.packing
      // In case it's a string
      if (typeof this.tips.packing === 'string') {
        try { return JSON.parse(this.tips.packing) } catch { return [this.tips.packing] }
      }
      return []
    }
  }
}
</script>

<style scoped>
.tips-section {
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
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.tip-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%);
  border-radius: 0.75rem;
  border: 2px solid rgba(16, 185, 129, 0.15);
  transition: all 0.3s ease;
}
.tip-card:hover { transform: translateY(-2px); }
.tip-icon { font-size: 1.75rem; flex-shrink: 0; }
.tip-content { flex: 1; }
.tip-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}
.tip-text {
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}
.packing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.packing-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  font-size: 0.8rem;
  border-radius: 9999px;
  font-weight: 500;
}
@media (max-width: 768px) {
  .tips-grid { grid-template-columns: 1fr; }
}
</style>
