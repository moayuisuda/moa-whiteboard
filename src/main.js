import Vue from 'vue'
import moaWhiteboard from '@/components/moa-whiteboard'
import vuetify from '@/components/vuetify';
import app from './pages/app.vue'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import './theme/base.scss'
import color from './theme/variable'

Vue.use(moaWhiteboard)
Vue.use(color)

new Vue({
  router,
  vuetify,
  el: '#app',
  render: (h) => h(app),
})
