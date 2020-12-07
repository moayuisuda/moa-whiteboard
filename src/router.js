import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/pages/Layout.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/layout' },
  { path: '/layout', component: layout },
]

const router = new VueRouter({
  routes,
})

export default router
