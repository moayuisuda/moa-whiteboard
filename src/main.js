import Vue from 'vue'
import components from '@/components'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import app from './pages/app.vue'
import './theme/base.scss'
import router from './router'

Vue.use(VueMaterial)
Vue.use(components)

new Vue({
  router,
  el: '#app',
  render: (h) => h(app),
})
