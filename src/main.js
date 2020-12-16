import Vue from 'vue'
import components from '@/components'
import vuetify from '@/components/vuetify';
import app from './pages/app.vue'
import router from './router'

import 'vuetify/dist/vuetify.min.css'
import './theme/base.scss'

Vue.use(components)

new Vue({
  router,
  vuetify,
  el: '#app',
  render: (h) => h(app),
})
