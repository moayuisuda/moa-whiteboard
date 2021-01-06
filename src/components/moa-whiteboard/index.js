import Vue from 'vue'

const context = require.context('./', true, /.vue$/)

export default {
  install() {
    console.log('Flow components has been installed:')
    context.keys().forEach((key) => {
      const component = context(key).default
      Vue.component(component.name, component)
    })
  },
}
