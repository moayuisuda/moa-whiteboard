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
        <span>{{ project.id }}</span>
        <!-- <span>{{ project.owner }}</span> -->
      </li>
    </ul>

    <moa-bar
      @logout="onLogout"
      @login="onLogin"
      @save="onSave"
      :editable="_editable"
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
      if (
        this.rootData.id === 'INIT' ||
        this.projects.find(project => {
          project.id === this.rootData.id
        })
      ) {
        return true
      }
      return false
    },
    _ifVisitor() {
      return this.$user.id === ''
    },
    _ifProvideId() {
      return this.$route.params.id !== 'INIT'
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
    async onSave() {
      try {
        await projectService.save({
          id: this.rootData.id,
          data: this.rootData
        })
        console.log('[moa] 已同步数据')
      } catch {}
    },
    async onLogin(form) {
      const userInfo = await userService.login(
        form.email,
        form.password,
        this.rootData
      )
      Object.assign(this.$user, userInfo)
      localStorage.setItem('TOKEN', userInfo.token)
      this.$router.push('/layout/whiteboard/' + userInfo.last_edit_project)
      this.projects = await projectService.getProjectList()
    },
    onLogout() {
      this.clearState()
    },
    clearState() {
      Object.assign(this.$user, { email: '', id: '' })
      localStorage.setItem('TOKEN', '')
      this.$router.push('/layout/whiteboard/INIT')
      this.projects = []
    }
  },
  // 切换项目
  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== 'INIT')
      this.rootData = await projectService.getProjectData(to.params.id)
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
