<template>
  <v-card elevation="2">
    <v-form ref="form">
      <v-text-field
        v-model="form.email"
        :rules="rules.email"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        v-model="form.password"
        :rules="rules.password"
        label="Password"
        required
      ></v-text-field>
      <v-btn @click="submit">
        Submit
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import * as userService from '@/services/user'
export default {
  name: 'moa-login',
  data() {
    return {
      rules: {
        password: [
          v => !!v || 'password is required',
          v => (v && v.length >= 8) || 'password must be more than 8 characters'
        ],
        email: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ]
      },
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