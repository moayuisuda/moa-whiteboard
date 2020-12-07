import Vue from 'vue'
import App from './pages/App.vue'
import './theme/base.scss'
import router from './router'

const instance = new Vue({
  router,
  el: '#app',
  render: (h) => h(App),
})
