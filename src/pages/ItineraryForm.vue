<template>
  <div class="itinerary-form-page">
    <Header />
    <main class="main-content">
      <div class="form-container">
        <div class="form-header">
          <div class="header-icon">{{ isEdit ? '✏️' : '✈️' }}</div>
          <h1 class="form-title">{{ isEdit ? '编辑行程' : 'AI 智能生成行程' }}</h1>
          <p class="form-subtitle">{{ isEdit ? '修改您的旅行计划' : '填写需求，AI 为您规划完美一日或多日行程' }}</p>
        </div>

        <!-- ============ 基本输入（新建和编辑共用） ============ -->
        <form @submit.prevent="submit" class="itinerary-form">
          <div class="form-row">
            <div class="input-group">
              <label>
                <span class="label-icon">🚀</span>
                出发地
              </label>
              <input
                v-model="model.startPlace"
                placeholder="请输入出发城市"
                required
                :disabled="generating"
              />
            </div>

            <div class="input-group">
              <label>
                <span class="label-icon">📍</span>
                目的地
              </label>
              <input
                v-model="model.destination"
                placeholder="请输入目的地城市"
                required
                :disabled="generating"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label>
                <span class="label-icon">📅</span>
                天数
              </label>
              <input
                type="number"
                v-model.number="model.days"
                placeholder="行程天数"
                required
                min="1"
                max="30"
                :disabled="generating"
                @change="updateDayCount"
              />
            </div>

            <div class="input-group">
              <label>
                <span class="label-icon">💰</span>
                预算（元）
              </label>
              <input
                type="number"
                v-model.number="model.budget"
                placeholder="总预算"
                required
                min="0"
                step="100"
                :disabled="generating"
              />
            </div>
          </div>

          <div class="input-group">
            <label>
              <span class="label-icon">❤️</span>
              旅行偏好
            </label>
            <div class="interest-tags">
              <button
                v-for="tag in interestTags"
                :key="tag"
                type="button"
                class="interest-tag"
                :class="{ active: model.interest === tag }"
                @click="model.interest = tag"
                :disabled="generating"
              >
                {{ tag }}
              </button>
            </div>
            <input
              v-model="model.interest"
              placeholder="或自定义偏好，例如：网红打卡、亲子乐园、博物馆等"
              style="margin-top: 0.5rem"
              :disabled="generating"
            />
          </div>

          <!-- ============ 新建模式：AI 生成按钮 + 加载状态 ============ -->
          <template v-if="!isEdit">
            <!-- 生成中状态 -->
            <div v-if="generating" class="generating-section">
              <div class="generating-animation">
                <div class="spinner"></div>
                <div class="generating-text">
                  <h3>🤖 AI 正在为您规划行程...</h3>
                  <p class="gen-step">{{ genStep }}</p>
                </div>
              </div>
              <div class="gen-progress">
                <div class="progress-step" :class="{ done: genStepIndex >= 0 }">
                  <span class="step-icon">🔍</span> 搜索{{ model.destination }}景点
                </div>
                <div class="progress-step" :class="{ done: genStepIndex >= 1 }">
                  <span class="step-icon">🌤️</span> 查询当地天气
                </div>
                <div class="progress-step" :class="{ done: genStepIndex >= 2 }">
                  <span class="step-icon">🏨</span> 搜索酒店住宿
                </div>
                <div class="progress-step" :class="{ done: genStepIndex >= 3 }">
                  <span class="step-icon">🧠</span> AI 智能编排行程
                </div>
                <div class="progress-step" :class="{ done: genStepIndex >= 4 }">
                  <span class="step-icon">✨</span> 生成完整方案
                </div>
              </div>
            </div>

            <!-- 生成按钮 -->
            <div class="form-actions" v-else>
              <button
                type="button"
                @click="$router.push('/itineraries')"
                class="btn btn-secondary btn-lg"
              >
                <span class="btn-icon">←</span>
                取消
              </button>
              <button type="submit" class="btn btn-primary btn-lg btn-generate">
                <span class="btn-icon">🤖</span>
                AI 智能生成行程
              </button>
            </div>
          </template>

          <!-- ============ 编辑模式：内容编辑器 ============ -->
          <template v-if="isEdit && parsedContent">
            <div class="itinerary-editor">
              <div class="editor-section">
                <div class="section-header-inline">
                  <span class="section-icon">📋</span>
                  <h2 class="section-title">行程概述</h2>
                </div>
                <div class="input-group">
                  <textarea
                    v-model="parsedContent.itinerary.summary"
                    placeholder="输入行程概述"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div class="editor-section">
                <div class="section-header-inline">
                  <span class="section-icon">📅</span>
                  <h2 class="section-title">每日行程安排</h2>
                </div>
                <div class="days-editor">
                  <div
                    v-for="(day, dayNum) in parsedContent.itinerary.days"
                    :key="dayNum"
                    class="day-editor-card"
                  >
                    <div class="day-header">
                      <div class="day-number">{{ dayNum }}</div>
                      <input v-model="day.title" class="day-title-input" placeholder="第{{ dayNum }}天" />
                      <button
                        v-if="Object.keys(parsedContent.itinerary.days).length > 1"
                        @click="removeDay(dayNum)"
                        class="remove-day-btn"
                      >✕</button>
                    </div>
                    <div class="day-fields">
                      <div class="time-field">
                        <span class="time-icon">🌅</span>
                        <input v-model="day.morning" placeholder="上午安排" class="time-input" />
                      </div>
                      <div class="time-field">
                        <span class="time-icon">☀️</span>
                        <input v-model="day.afternoon" placeholder="下午安排" class="time-input" />
                      </div>
                      <div class="time-field">
                        <span class="time-icon">🌙</span>
                        <input v-model="day.evening" placeholder="晚上安排" class="time-input" />
                      </div>
                      <div class="time-field">
                        <span class="time-icon">🏨</span>
                        <input v-model="day.accommodation" placeholder="住宿安排" class="time-input" />
                      </div>
                      <div class="time-field">
                        <span class="time-icon">🍽️</span>
                        <input v-model="day.food" placeholder="推荐美食" class="time-input" />
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" @click="addDay" class="btn btn-secondary add-day-btn">
                  <span class="btn-icon">+</span> 添加一天
                </button>
              </div>

              <div class="editor-section">
                <div class="section-header-inline">
                  <span class="section-icon">🏛️</span>
                  <h2 class="section-title">推荐景点</h2>
                </div>
                <div class="spots-editor">
                  <div
                    v-for="(spot, index) in parsedContent.scenicSpots?.spots"
                    :key="index"
                    class="spot-editor-card"
                  >
                    <div class="spot-icon">📍</div>
                    <div class="spot-fields">
                      <input v-model="spot.name" placeholder="景点名称" class="spot-input" />
                      <input v-model="spot.address" placeholder="景点地址" class="spot-input" />
                      <input v-model="spot.type" placeholder="景点类型" class="spot-input spot-type-input" />
                    </div>
                    <button
                      v-if="parsedContent.scenicSpots?.spots?.length > 1"
                      @click="removeSpot(index)"
                      class="remove-spot-btn"
                    >✕</button>
                  </div>
                </div>
                <button type="button" @click="addSpot" class="btn btn-secondary add-spot-btn">
                  <span class="btn-icon">+</span> 添加景点
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                @click="$router.push('/itineraries')"
                class="btn btn-secondary btn-lg"
              >
                <span class="btn-icon">←</span>
                取消
              </button>
              <button type="submit" class="btn btn-primary btn-lg">
                <span class="btn-icon">💾</span>
                保存修改
              </button>
            </div>
          </template>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import api from '../api/api'
import Header from '../components/Header.vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  components: { Header },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const id = route.params.id
    const isEdit = !!id
    const model = ref({ startPlace:'', destination:'', days:1, budget:0, interest:'', content:'' })
    const parsedContent = ref(null)
    const generating = ref(false)
    const genStepIndex = ref(0)
    const genStep = ref('')

    const interestTags = ['自然风光', '历史文化', '美食体验', '网红打卡', '亲子乐园', '博物馆', '户外运动', '休闲度假']

    const genSteps = [
      { text: '正在搜索景点数据...', icon: '🔍' },
      { text: '正在查询天气预报...', icon: '🌤️' },
      { text: '正在搜索酒店住宿...', icon: '🏨' },
      { text: 'AI 正在智能编排行程...', icon: '🧠' },
      { text: '正在生成完整旅行方案...', icon: '✨' },
    ]

    const runGenAnimation = () => {
      genStepIndex.value = 0
      let i = 0
      const timer = setInterval(() => {
        if (i < genSteps.length) {
          genStepIndex.value = i
          genStep.value = genSteps[i].text
          i++
        } else {
          clearInterval(timer)
        }
      }, 800)
      return timer
    }

    const initParsedContent = () => {
      parsedContent.value = {
        version: "1.0",
        generateTime: new Date().toString(),
        destination: model.value.destination,
        days: model.value.days,
        budget: model.value.budget,
        interest: model.value.interest,
        itinerary: {
          summary: '',
          days: {},
          tips: { general: '' },
          generatedBy: 'user'
        },
        scenicSpots: { spots: [], count: 0, totalCount: 0 },
        hotels: { hotels: [], count: 0 },
        weather: { forecasts: [] },
        statistics: { totalSpots: 0 }
      }
      for (let i = 1; i <= model.value.days; i++) {
        parsedContent.value.itinerary.days[i] = {
          title: `第${i}天`, morning: '', afternoon: '', evening: '', accommodation: '', food: ''
        }
      }
    }

    const updateDayCount = () => {
      if (!parsedContent.value || !isEdit) return
      const currentDays = Object.keys(parsedContent.value.itinerary.days).length
      const newDays = model.value.days
      if (newDays > currentDays) {
        for (let i = currentDays + 1; i <= newDays; i++) {
          parsedContent.value.itinerary.days[i] = {
            title: `第${i}天`, morning: '', afternoon: '', evening: '', accommodation: '', food: ''
          }
        }
      } else if (newDays < currentDays) {
        const keys = Object.keys(parsedContent.value.itinerary.days)
        for (let i = keys.length; i > newDays; i--) {
          delete parsedContent.value.itinerary.days[i]
        }
      }
      model.value.days = Object.keys(parsedContent.value.itinerary.days).length
    }

    const addDay = () => {
      if (!parsedContent.value) return
      const newDayNum = Object.keys(parsedContent.value.itinerary.days).length + 1
      parsedContent.value.itinerary.days[newDayNum] = {
        title: `第${newDayNum}天`, morning: '', afternoon: '', evening: '', accommodation: '', food: ''
      }
      model.value.days = newDayNum
    }

    const removeDay = (dayNum) => {
      if (!parsedContent.value) return
      delete parsedContent.value.itinerary.days[dayNum]
      const days = Object.keys(parsedContent.value.itinerary.days)
      days.forEach((key, index) => {
        const newKey = index + 1
        if (parseInt(key) !== newKey) {
          parsedContent.value.itinerary.days[newKey] = parsedContent.value.itinerary.days[key]
          parsedContent.value.itinerary.days[newKey].title = `第${newKey}天`
          delete parsedContent.value.itinerary.days[key]
        }
      })
      model.value.days = Object.keys(parsedContent.value.itinerary.days).length
    }

    const addSpot = () => {
      if (!parsedContent.value) return
      if (!parsedContent.value.scenicSpots) parsedContent.value.scenicSpots = { spots: [], count: 0 }
      parsedContent.value.scenicSpots.spots.push({ name: '', address: '', type: '' })
      parsedContent.value.scenicSpots.count = parsedContent.value.scenicSpots.spots.length
    }

    const removeSpot = (index) => {
      if (!parsedContent.value) return
      parsedContent.value.scenicSpots.spots.splice(index, 1)
      parsedContent.value.scenicSpots.count = parsedContent.value.scenicSpots.spots.length
    }

    onMounted(async () => {
      if (isEdit) {
        const resp = await api.get(`/itinerary/${id}`)
        Object.assign(model.value, resp.data)
        if (model.value.content) {
          try {
            const content = typeof model.value.content === 'string'
              ? JSON.parse(model.value.content)
              : model.value.content
            parsedContent.value = { ...content }
          } catch (e) {
            initParsedContent()
          }
        } else {
          initParsedContent()
        }
      }
    })

    const submit = async () => {
      try {
        if (isEdit) {
          // 编辑模式：保存带内容的行程
          if (parsedContent.value) {
            parsedContent.value.destination = model.value.destination
            parsedContent.value.days = model.value.days
            parsedContent.value.budget = model.value.budget
            parsedContent.value.interest = model.value.interest
            parsedContent.value.generateTime = new Date().toString()
            model.value.content = JSON.stringify(parsedContent.value)
          }
          await api.put(`/itinerary/${id}`, model.value)
          router.push(`/itineraries/${id}`)
        } else {
          // 🔥 新建模式：不传 content，让后端触发 AI 生成！
          generating.value = true
          const animTimer = runGenAnimation()

          const resp = await api.post('/itinerary', {
            startPlace: model.value.startPlace,
            destination: model.value.destination,
            days: model.value.days,
            budget: model.value.budget,
            interest: model.value.interest || '自然风光'
            // 不传 content → 后端触发 generateItinerary() 调用 AI
          })

          clearInterval(animTimer)
          genStepIndex.value = 4
          genStep.value = '✅ 行程生成完毕！'

          setTimeout(() => {
            router.push(`/itineraries/${resp.data.id}`)
          }, 600)
        }
      } catch (e) {
        generating.value = false
        alert('操作失败：' + (e.response?.data?.message || e.message))
      }
    }

    watch(() => model.value.days, updateDayCount)

    return {
      model, submit, isEdit, parsedContent,
      addDay, removeDay, addSpot, removeSpot, updateDayCount,
      generating, genStepIndex, genStep, interestTags
    }
  }
}
</script>

<style scoped>
.itinerary-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.form-container {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.form-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 2px solid #edf2f7;
}
.header-icon { font-size: 4rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.form-subtitle { color: #718096; font-size: 1.125rem; margin: 0; }
.itinerary-form { padding: 2.5rem 2rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
.input-group { margin-bottom: 1.5rem; }
.input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}
.label-icon { font-size: 1.25rem; }
.input-group input,
.input-group textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
  font-family: inherit;
}
.input-group input:focus,
.input-group textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
  outline: none;
}
.input-group input:disabled { opacity: 0.6; cursor: not-allowed; }

/* Interest Tags */
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.interest-tag {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 2rem;
  background: white;
  color: #4a5568;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.interest-tag:hover { border-color: #667eea; color: #667eea; }
.interest-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}
.interest-tag:disabled { opacity: 0.5; cursor: not-allowed; }

/* Generating Animation */
.generating-section {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 1rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
}
.generating-animation {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
.generating-text h3 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
  font-size: 1.25rem;
}
.gen-step { color: #667eea; font-weight: 500; margin: 0; }
.gen-progress {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.progress-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #a0aec0;
  transition: all 0.3s ease;
}
.progress-step.done {
  color: #059669;
  background: rgba(16, 185, 129, 0.08);
}
.step-icon { font-size: 1rem; }
.btn-generate {
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
}

/* Editor (edit mode only) */
.itinerary-editor { margin-top: 2rem; }
.editor-section { margin-bottom: 2rem; }
.section-header-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.section-icon { font-size: 1.25rem; }
.section-title { font-size: 1.25rem; font-weight: 600; color: #1a202c; margin: 0; }
.days-editor { display: flex; flex-direction: column; gap: 1rem; }
.day-editor-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}
.day-editor-card:hover { border-color: #667eea; }
.day-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.day-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: 700;
  color: #667eea;
}
.day-title-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  outline: none;
}
.day-title-input::placeholder { color: rgba(255, 255, 255, 0.7); }
.remove-day-btn, .remove-spot-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.remove-day-btn:hover, .remove-spot-btn:hover { background: rgba(239, 68, 68, 0.8); }
.day-fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; padding: 1.25rem; }
.time-field { display: flex; align-items: center; gap: 0.75rem; }
.time-icon { font-size: 1.25rem; flex-shrink: 0; }
.time-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;
}
.time-input:focus { border-color: #667eea; outline: none; }
.add-day-btn, .add-spot-btn { margin-top: 1rem; width: 100%; }
.spots-editor { display: flex; flex-direction: column; gap: 1rem; }
.spot-editor-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.05) 0%, rgba(66, 153, 225, 0.05) 100%);
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}
.spot-editor-card:hover { border-color: #48bb78; }
.spot-icon { font-size: 1.5rem; flex-shrink: 0; }
.spot-fields { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.spot-input {
  padding: 0.625rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;
}
.spot-input:focus { border-color: #48bb78; outline: none; }
.spot-type-input { width: fit-content; min-width: 100px; }

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #edf2f7;
}
.form-actions .btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
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
.btn-lg { padding: 1rem 2rem; font-size: 1.1rem; }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102,126,234,0.4); }
.btn-secondary { background: #f7fafc; border: 2px solid #e2e8f0; color: #4a5568; }
.btn-secondary:hover { background: #edf2f7; }

@media (max-width: 768px) {
  .main-content { padding: 1rem 0.5rem; }
  .form-header { padding: 2rem 1.5rem 1.5rem; }
  .header-icon { font-size: 3rem; }
  .form-title { font-size: 1.5rem; }
  .form-subtitle { font-size: 1rem; }
  .itinerary-form { padding: 1.5rem 1rem; }
  .form-row { grid-template-columns: 1fr; gap: 1rem; }
  .day-fields { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column; }
  .form-actions .btn { width: 100%; }
}
</style>
