import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsView from '@/views/AnalyticsView.vue'

const routes = [
  {
    path: '/',
    name: 'Analytics',
    component: AnalyticsView,
    meta: {
      title: 'Аналитика Wildberries'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Wildberries Analytics'
  next()
})

export default router