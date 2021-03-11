<template>
  <div class="whiteboard">
    <moa-whiteboard
      :rootData="rootData"
      :editable="_editable"
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
      stageBounds: {
        w: 1080,
        h: 720
      }
    }
  },
  computed: {
    _editable() {
      const editList = this.rootData.auth.edit.split(',')
      if (editList.includes(this.$user.uuid) || editList[0] === '*') {
        return true
      }
      return false
    },
    _ifVisitor() {
      return this.$user.uuid === ''
    },
    _ifProvideId() {
      return this.$route.params.id !== 'temp'
    }
  },
  methods: {
    changeProject(id) {
      this.$router.push({ path: id })
    },
    onResize() {
      this.stageBounds.w = document.documentElement.clientWidth
      this.stageBounds.h = document.documentElement.clientHeight
    },
    async onLogin(userInfo) {
      console.log('login')
      Object.assign(this.$user, userInfo)
      localStorage.setItem('TOKEN', userInfo.token)
      this.projects = await projectService.getProjectList()
      this.$router.push('/layout/whiteboard/' + userInfo.last_edit_project)
    },
    onLogout() {
      Object.assign(this.$user, { token: '', name: '' })
      localStorage.setItem('TOKEN', '')
      this.$router.push('/layout/whiteboard/visitor')
    }
  },
  // 切换项目
  async beforeRouteUpdate(to, from, next) {
    this.rootData = await projectService.getProjectData(to.params.id)
    console.log('editable', this._editable)
    next()
  },
  // 首次进入
  async created() {
    this.stageBounds.w = document.documentElement.clientWidth
    this.stageBounds.h = document.documentElement.clientHeight

    window.addEventListener('resize', this.onResize)

    // 用户状态
    if (localStorage.getItem('TOKEN')) {
      const info = await userService.getUserInfo()
      Object.assign(this.$user, info)
      this.projects = await projectService.getProjectList()

      if (!this._ifProvideId) {
        this.$router.push('/layout/whiteboard/' + this.$user.last_edit_project)
      }
    }
    // 初始指定了特定项目的情况，注意这里不需要跳转，本身就是特定链接了
    if (this._ifProvideId) {
      this.rootData = await projectService.getProjectData(this.$route.params.id)
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
