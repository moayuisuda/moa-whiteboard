<template>
  <div class="whiteboard">
    <moa-whiteboard
      :rootData="rootData"
      :editable="_editable"
      :width="stageBounds.w"
      :height="stageBounds.h"
    >
    </moa-whiteboard>

    <ul
      v-if="$user.email"
      class="card moa-sidebar"
    >
      <li
        @click="changeProject(project.id)"
        v-for="project in $wbState.projects"
        :key="project.id"
        class="hover-item center"
        :class="{
          'hover-item--selected': rootData.id === project.id
        }"
      >
        <span>{{ project.id }}</span>
        <i
          @click.stop="onDelete"
          class="moa-sidebar__dele"
        >×</i>
        <!-- <span>{{ project.owner }}</span> -->
      </li>
      <li
        class="hover-item moa-sidebar__add center"
        @click="addProject"
      >
        ＋
      </li>
    </ul>

    <moa-bar
      @logout="onLogout"
      @login="onLogin"
      @save="onSave"
      @share="onShare"
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
import { eventBus } from '@/state'
import { selectText } from '@/utils/text'
import { toDataURL as QRCodeURL } from 'qrcode'

export default {
  name: 'whiteboard',
  components: {
    moaBar
  },
  data() {
    return {
      rootData,
      stageBounds: {
        w: 1080,
        h: 720
      }
    }
  },
  watch: {
    '$wbState.projects': {
      handler(val) {
        console.log(val)
      }
    }
  },
  computed: {
    _editable() {
      if (
        this.rootData.id === 'INIT' ||
        this.$wbState.projects.find(project => {
          return project.id === this.rootData.id
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
    async onShare() {
      const span = document.createElement('span')
      document.body.appendChild(span)
      span.innerText = location.href
      // debugger
      selectText(span)
      document.execCommand('copy')
      document.body.removeChild(span)
      const dataURL = await QRCodeURL(location.href)
      const a = document.createElement('a')
      a.download = 'qrcode.png'
      a.href = dataURL
      a.click()
      alert('分享链接已复制到剪切板')
    },
    async addProject() {
      await projectService.add()
      this.$wbState.projects = await projectService.getProjectList()
      this.$router.push(
        '/layout/whiteboard/' + this.$wbState.projects.last().id
      )
    },
    changeProject(id) {
      this.$router.push({ path: id })
    },
    onResize() {
      this.stageBounds.w = document.documentElement.clientWidth
      this.stageBounds.h = document.documentElement.clientHeight
    },
    async onDelete() {
      if (this.$wbState.projects.length === 1) {
        console.log('[moa] 最少保留一个项目')
        return
      }
      await projectService.dele(this.rootData.id)
      this.$wbState.projects = await projectService.getProjectList()
      this.$router.push(
        '/layout/whiteboard/' + this.$wbState.projects.last().id
      )
    },
    async onSave() {
      try {
        await projectService.save(this.rootData.id, this.rootData)
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
      this.$wbState.projects = await projectService.getProjectList()
    },
    onLogout() {
      this.clearState()
    },
    clearState() {
      Object.assign(this.$user, { email: '', id: '' })
      localStorage.setItem('TOKEN', '')
      this.$router.push('/layout/whiteboard/INIT')
      this.$wbState.projects = []
    }
  },
  // 切换项目
  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== 'INIT') {
      this.rootData = await projectService.getProjectData(to.params.id)
      userService.updateLastEditProjct(to.params.id)
    } else this.rootData = rootData
    next()
  },
  // 首次进入
  async created() {
    eventBus.$on('unauthorized', this.onLogout)
    this.stageBounds.w = document.documentElement.clientWidth
    this.stageBounds.h = document.documentElement.clientHeight

    window.addEventListener('resize', this.onResize)

    // 用户状态
    if (localStorage.getItem('TOKEN')) {
      const info = await userService.getUserInfo()
      Object.assign(this.$user, info)
      this.$wbState.projects = await projectService.getProjectList()

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
  width: 200px;
  right: 20px;
  top: 100px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  &__add {
    font-size: 30px;
    font-weight: 400;
  }

  &__dele {
    font-size: 30px;
    &:hover {
      color: $danger-color;
    }
  }
}
</style>
