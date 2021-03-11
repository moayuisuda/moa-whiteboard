import Vue from 'vue'

const user = {
  token: '',
  name: '',
  uuid: ''
}

Vue.observable(user)

export {
  user
}

