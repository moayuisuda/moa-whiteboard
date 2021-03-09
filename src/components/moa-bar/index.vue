<template>
  <ul class="moa-bar center">
    <login-panel v-if="ifShowLogin" @loginSuccess="onLoginSuccess"></login-panel>
    <li class="moa-bar__item">
      <h2 v-if="$user.name">{{ $user.name }}</h2>
      <v-btn
        @click="login"
        v-else
      >
        Login
      </v-btn>
    </li>
    <li
      @click="share()"
      class="moa-bar__item"
    >
      <img src="@/assets/share.svg" />
    </li>
  </ul>
</template>

<script>
import loginPanel from './login.vue'
export default {
  name: 'moa-bar',
  components: {
    loginPanel
  },
  data() {
    return {
      ifShowLogin: false
    }
  },
  computed: {},
  methods: {
    login() {
      this.ifShowLogin = true
    },
    onLoginSuccess(userInfo) {
      this.$emit('login', userInfo)
    },
    share() {}
  }
}
</script>

<style lang="scss" scoped>
.moa-bar {
  background-color: white;
  border-radius: $radius;
  &__item {
    img {
      display: block;
    }
    padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: $background-color;
    }
  }
}
</style>
