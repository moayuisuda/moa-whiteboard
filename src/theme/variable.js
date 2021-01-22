import Vue from 'vue'

export default {
  install() {
    Vue.prototype.$color = {
      "main": '#ff8c28',
      "support": '#8c28ff',
      'danger': '#f44336',
      'background': '#EDF1F5',
      'line': '#8E8E8E',
      'text': '#333',
    }
    Vue.prototype.$style = {
      'radius': '8',
      'stroke-width': '2'
    }
  },
}
