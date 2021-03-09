<template>
  <div class="whiteboard">
    <moa-whiteboard
      :rootData="rootData"
      :editable="editable"
      :width="stageBounds.w"
      :height="stageBounds.h"
    >
    </moa-whiteboard>
    <moa-bar
      @login="onLogin"
      class="moa-bar shadow"
    ></moa-bar>
  </div>
</template>

<script>
import moaBar from '@/components/moa-bar/index.vue'
import * as userService from '@/services/user'
import * as projectService from '@/services/project'
import rootData from './data.json'

export default {
  name: 'whiteboard',
  components: {
    moaBar
  },
  data() {
    return {
      rootData,
      editable: true,
      stageBounds: {
        w: 1080,
        h: 720
      }
    }
  },
  methods: {
    onResize() {
      this.stageBounds.w = document.documentElement.clientWidth
      this.stageBounds.h = document.documentElement.clientHeight
    },
    async onLogin(userInfo) {
      Object.assign(this.$user, userInfo)
      localStorage.setItem('TOKEN', userInfo.token)
    }
  },
  async created() {
    this.stageBounds.w = document.documentElement.clientWidth
    this.stageBounds.h = document.documentElement.clientHeight

    window.addEventListener('resize', this.onResize)

    if (localStorage.getItem('TOKEN')) {
      const info = await userService.getUserInfo()
      Object.assign(this.$user, info)
      this.rootData = await projectService.getProjectData('STATE_ID')
      console.log(this.rootData, rootData)
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-bar {
  position: absolute;
  right: 20px;
  top: 20px;
  list-style: none;
}
</style>
