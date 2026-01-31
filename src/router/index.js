import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import OrderManagement from '../components/OrderManagement.vue'
import Staff from '../components/Staff.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderManagement
  },
  {
    path: '/staff',
    name: 'Staff',
    component: Staff
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
