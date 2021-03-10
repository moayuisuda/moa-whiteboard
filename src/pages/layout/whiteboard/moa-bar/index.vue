<template>
  <ul class="moa-bar center">
    <li class="moa-bar__item">
      <div v-if="$user.name">
        <h3>{{ $user.name }}</h3>
        <button @click="logout">logout</button>
      </div>

      <div v-else>
        Login
        <login-panel @loginSuccess="onLoginSuccess"></login-panel>
      </div>

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
    return {}
  },
  computed: {},
  methods: {
    logout() {
      this.$emit('logout')
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
