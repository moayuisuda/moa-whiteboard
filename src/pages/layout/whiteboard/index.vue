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
      <li class="hover-item center">
        <input
          @blur="changeName"
          class="moa-sidebar__title hover-item--selected"
          type="text"
          v-model="name"
        >
      </li>
      <li
        @click="changeProject(project.id)"
        v-for="project in $wbState.projects"
        :key="project.id"
        class="hover-item"
        :class="{
          'hover-item--selected': rootData.id === project.id
        }"
      >
        <div
          v-if="!(rootData.id === project.id)"
          class="center moa-sidebar__item"
        >
          <span>{{ project.name }}</span>
          <i
            @click.stop="onDelete(project.id)"
            class="moa-sidebar__dele"
          >×</i>
        </div>
      </li>
      <li
        class="hover-item moa-sidebar__add center"
        @click="addProject"
      >
        ＋
      </li>
    </ul>

    <moa-bar
      @generate-flow="onGenerateFlow"
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
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'whiteboard',
  components: {
    moaBar
  },
  data() {
    return {
      name: '',
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
    async onGenerateFlow(str) {
      const values = str.split(/[,，]/)
      const nodes = []
      const chartData = this.rootData.panelData.chartData

      for (let i = 0; i < values.length; i++) {
        const nodeData = this.$componentsConfig[`moa-basic`].defaultData()
        nodeData.id = uuidv4()
        nodeData.model.value = values[i]

        if (i > 0) {
          const lineData = this.$componentsConfig['moa-line'].defaultData()
          lineData.id = uuidv4()
          lineData.start = nodes[i - 1].id
          lineData.startP = 'right'
          lineData.end = nodeData.id
          lineData.endP = 'left'
          chartData.push(lineData)
        }
        nodeData.bounds.y = this.rootData.panelData.panelOps.y + 100
        nodeData.bounds.x += this.rootData.panelData.panelOps.x + i * 200 + 100
        nodes.push(nodeData)
        chartData.push(nodeData)
      }
    },
    async onShare() {
      const span = document.createElement('span')
      document.body.appendChild(span)
      span.innerText = location.href
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
    async onDelete(id) {
      if (this.$wbState.projects.length === 1) {
        console.log('[moa] 最少保留一个项目')
        return
      }
      await projectService.dele(id)
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
    },
    async changeName() {
      await projectService.updateName(this.rootData.id, this.name)
      this.$wbState.projects = await projectService.getProjectList()
      console.log('[moa] 更新名称成功')
    }
  },

  // 切换项目
  async beforeRouteUpdate(to, from, next) {
    if (to.params.id !== 'INIT') {
      const data = (this.rootData = await projectService.getProjectData(
        to.params.id
      ))
      this.rootData = data.data
      this.name = data.name
      userService.updateLastEditProjct(to.params.id)
    } else {
      this.rootData = rootData
      this.name = '演示项目'
    }
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
      const data = await projectService.getProjectData(this.$route.params.id)
      this.rootData = data.data
      this.name = data.name
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
  width: 160px;
  right: 20px;
  top: 100px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;

  &__item {
    justify-content: space-between;
  }

  &__title {
    width: 100%;
    font-weight: bold;
    text-align: center;
    border: none;
  }

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
