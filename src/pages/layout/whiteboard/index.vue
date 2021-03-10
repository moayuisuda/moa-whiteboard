<template>
  <div class="whiteboard">
    <moa-whiteboard
      :rootData="rootData"
      :editable="editable"
      :width="stageBounds.w"
      :height="stageBounds.h"
    >
    </moa-whiteboard>

    <ul class="card moa-sidebar">
      <li
        @click="changeProject(project.id)"
        v-for="project in projects"
        :key="project.id"
        class="hover-item"
      >
        <span>{{ project.name }}</span>
        <span>{{ project.owner }}</span>
      </li>
    </ul>

    <moa-bar
      @logout="onLogout"
      @login="onLogin"
      class="moa-bar shadow"
    ></moa-bar>
  </div>
</template>

<script>
import moaBar from './moa-bar/index.vue'
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
      projects: [],
      editable: true,
      stageBounds: {
        w: 1080,
        h: 720
      }
    }
  },
  methods: {
    async changeProject(id) {
      this.rootData = await projectService.getProjectData(id)
    },
    onResize() {
      this.stageBounds.w = document.documentElement.clientWidth
      this.stageBounds.h = document.documentElement.clientHeight
    },
    async onLogin(userInfo) {
      Object.assign(this.$user, userInfo)
      localStorage.setItem('TOKEN', userInfo.token)
      this.rootData = await projectService.getProjectData(
        userInfo.last_edit_project
      )
    },
    onLogout() {
      Object.assign(this.$user, { token: '', name: '' })
      localStorage.setItem('TOKEN', '')
      this.rootData = rootData
    }
  },
  async created() {
    this.stageBounds.w = document.documentElement.clientWidth
    this.stageBounds.h = document.documentElement.clientHeight

    window.addEventListener('resize', this.onResize)

    if (localStorage.getItem('TOKEN')) {
      const info = await userService.getUserInfo()
      Object.assign(this.$user, info)
      this.projects = await projectService.getProjectList()
      this.rootData = await projectService.getProjectData('STATE_ID')
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

.moa-sidebar {
  position: absolute;
  right: 20px;
  top: 100px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  &__item {
    cursor: pointer;
  }
}
</style>
