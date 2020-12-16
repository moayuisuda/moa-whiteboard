import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const contextRoutes = []
const context = require.context('./pages', true, /index.vue$/)
context.keys().forEach(key => {
  const path = key.replace(/\/index.vue$/, '').replace(/\./, '')
  const component = context(key).default

  contextRoutes.push({
    path,
    component,
    name: component.name
  })
})

const routes = [
  { path: '/', redirect: '/layout/flow' },
  ...contextRoutes
]

const router = new VueRouter({
  routes,
})

export default router
