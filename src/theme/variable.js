import Vue from 'vue'

export default {
  install() {
    Vue.prototype.$color = {
      'success-color': '#01b46d',
      'error-color': '#e0375f',
      'warning-color': '#fb9400',
      'info-color': '#3782ff',
      'danger-color': '#e0375f',
      'label-color': '#8E8E8E',
      'text-color': '#505050',
      'background-color': '#EAEAEA',
      'primary-color': '#3782ff',
      'primary-hover-color': '#5293ff',
      'primary-active-color': '#1644b8',
      'primary-bg-color': '#e7f3ff',
      'primary-active-bg-color': '#d2e8ff',
    }
  },
}
