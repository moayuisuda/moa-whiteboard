import Vue from 'vue'

const user = {
  email: '',
  id: ''
}

const eventBus = new Vue()

Vue.observable(user)

export {
  eventBus,
  user
}

