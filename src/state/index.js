import Vue from 'vue'

const user = {
  token: '',
  name: ''
}

Vue.observable(user)

export {
  user
}

