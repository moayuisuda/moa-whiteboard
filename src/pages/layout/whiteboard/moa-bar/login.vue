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
      console.log('bar')
      this.$emit('login', this.form)
    }
  }
}
</script>