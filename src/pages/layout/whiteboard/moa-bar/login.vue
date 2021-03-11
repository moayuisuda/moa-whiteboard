<template>
  <div ref="form">
    <input
      v-model="form.email"
      placeholder="Email"
    />
    <input
      v-model="form.password"
      placeholder="Password"
      required
    />
    <button @click="submit">
      Submit
    </button>
  </div>
</template>

<script>
import * as userService from '@/services/user'
export default {
  name: 'moa-login',
  data() {
    return {
      form: {
        password: '',
        email: ''
      }
    }
  },
  methods: {
    async submit() {
      const userInfo = await userService.login('OBJECT_FORM_DATA')
      this.$emit('loginSuccess', userInfo)
    }
  }
}
</script>