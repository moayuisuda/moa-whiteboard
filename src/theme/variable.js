import Vue from 'vue'

export default {
  install() {
    Vue.prototype.$color = {
      "main": '#f44336',
      'background': '#EDF1F5',
      'line': '#8E8E8E',
      'text': '#505050',
    }
  },
}
