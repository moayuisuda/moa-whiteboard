<template>
  <ul class="moa-bar center">
    <h1 v-if="!editable">view only</h1>
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
      class="moa-bar__item moa-text"
    >
      <div
        v-if="showTextPanel"
        class="moa-text-panel center"
      >
        <input
          placeholder="input like 'A,B,C'"
          type="text"
          v-model="text"
        >
        <button @click="generateFlow">Generate</button>
      </div>
      <img
        @click="showTextPanel = (showTextPanel === true) ? false : true"
        src="@/assets/text.svg"
      />
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
    return {
      text: '',
      showTextPanel: false
    }
  },
  props: {
    editable: {
      type: Boolean
    }
  },
  computed: {},
  methods: {
    generateFlow() {
      this.showTextPanel = false
      this.$emit('generate-flow', this.text)
    },
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
      width: 36px;
    }
    padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: $background-color;
    }
  }
}

.moa-text {
  position: relative;
  &-panel {
    position: absolute;
    top: 100%;
    right: 0;
  }
}
</style>
