<template>
  <ul class="moa-bar center">
    {{ $user.email + editable }}
    <li class="moa-bar__item">
      <div v-if="$user.email">
        <h3>{{ $user.email }}</h3>
        <button @click="logout">logout</button>
      </div>

      <div v-else>
        Login
        <login-panel @login="onLogin"></login-panel>
      </div>

    </li>

    <li
      v-if="$user.email && editable"
      @click="save"
      class="moa-bar__item"
    >
      <img src="@/assets/save.svg" />
    </li>

    <li
      v-if="$user.email && editable"
      @click="share"
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
  props: {
    editable: {
      type: Boolean
    }
  },
  computed: {},
  methods: {
    logout() {
      this.$emit('logout')
    },
    onLogin(userInfo) {
      this.$emit('login', userInfo)
    },
    share() {
      this.$emit('share')
    },
    save() {
      this.$emit('save')
    }
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
      width: 36px
    }
    padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: $background-color;
    }
  }
}
</style>
