import Vue from 'vue'

const user = {
  email: '',
  id: '',
  projects: ''
}

Vue.observable(user)

export {
  user
}

