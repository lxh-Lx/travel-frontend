import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import ItineraryList from '../pages/ItineraryList.vue'
import ItineraryDetail from '../pages/ItineraryDetail.vue'
import ItineraryForm from '../pages/ItineraryForm.vue'
import UserCenter from '../pages/UserCenter.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/itineraries' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/itineraries', component: ItineraryList, meta: { requiresAuth: true } },
  { path: '/itineraries/new', component: ItineraryForm, meta: { requiresAuth: true } },
  { path: '/itineraries/:id', component: ItineraryDetail, meta: { requiresAuth: true } },
  { path: '/itineraries/:id/edit', component: ItineraryForm, meta: { requiresAuth: true } },
  { path: '/profile', component: UserCenter, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

export default router

