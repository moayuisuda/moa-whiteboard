import Vue from 'vue'

const context = require.context('./', true, /index.vue$/)

export default {
  install() {
    context.keys().forEach((key) => {
      const component = context(key).default
      Vue.component(component.name, component)
    })
  },
}