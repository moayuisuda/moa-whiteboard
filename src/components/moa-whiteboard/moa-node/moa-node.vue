<template>
  <g
    :filter="_filter"
    v-if="nodeData.type !== 'line'"
    @mousedown="onMousedown"
    @dblclick.stop="onDblclick"
    :transform="_transform"
    :class="`moa-node node-${nodeData.id}`"
  >
    <component
      :is="`moa-${nodeData.type}`"
      :nodeData="nodeData"
      :isEdit="_isEdit"
      :isFocus="_isFocus"
    />
    <!-- 拉伸器 -->
    <moa-transformer
      :node-data="nodeData"
      :dots-show="_isFocus"
    />
    <!-- 删除节点 -->
    <image
      v-if="!_isEdit && _isFocus"
      @click="onDelete"
      :x="nodeData.bounds.w - 25"
      y=10
      width="20"
      height="20"
      xlink:href="../assets/close.svg"
    ></image>
    <!-- 连线 -->
    <image
      v-if="!_isEdit && _isFocus"
      @click.stop="onConnect"
      :x="nodeData.bounds.w - 50"
      y=10
      width="20"
      height="20"
      xlink:href="../assets/connect.svg"
    ></image>
  </g>

  <moa-line
    v-else
    :lineData="nodeData"
    @delete="onDelete"
    @path-click="onMousedown"
    @edit="onDblclick"
    :isEdit="_isEdit"
    :isFocus="_isFocus"
  />
</template>

<script>
import { getCoords, getSVGScale } from '~/utils/coords'
import { eventBus, wbState, hotKey } from '~/state'
import { v4 } from 'uuid'
const moveThreshold = 10

export default {
  name: 'moa-node',
  inject: ['container', 'root'],
  data() {
    return {}
  },
  computed: {
    _filter() {
      if (this.nodeData.type !== 'board') return 'url(#shadow)'
      else return ''
    },
    _inLines() {
      const re = []
      const lines = this.container.nodeData.panelData.chartData.filter(n => {
        return n.type === 'line'
      })
      for (let l of lines) {
        if (l.end === this.nodeData.id) {
          re.push(l)
        }
      }
      return re
    },
    _outLines() {
      const re = []
      const lines = this.container.nodeData.panelData.chartData.filter(n => {
        return n.type === 'line'
      })
      for (let l of lines) {
        if (l.start === this.nodeData.id) {
          re.push(l)
        }
      }
      return re
    },
    _isFocus() {
      return wbState.focusNodes.includes(this)
    },
    _isEdit() {
      return wbState.editNode === this
    },
    _transform() {
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    }
  },
  methods: {
    onConnect() {
      if (wbState.connectNodes.length !== 0) {
        wbState.connectNodes = []
      }
      wbState.connectNodes.push(this)
    },
    lineTo(des) {
      // debugger
      const nodes = this.container.nodeData.panelData.chartData
      if (this._outLines.find(line => line.end === des.nodeData.id)) return
      const lineData = this.$componentsConfig['moa-line'].defaultData()
      lineData.id = v4()
      lineData.start = this.nodeData.id
      lineData.end = des.nodeData.id
      const index = Math.min(
        nodes.indexOf(this.nodeData),
        nodes.indexOf(des.nodeData)
      )
      nodes.splice(index - 1 >= 0 ? index - 1 : 0, 0, lineData)
      wbState.connectNodes = []
    },
    onMousedown(e) {
      console.log('click')
      if (wbState.preAddNode) {
        return
      }
      if (wbState.connectNodes.length === 1) {
        const startNode = wbState.connectNodes[0]
        if (startNode === this) return
        if (startNode.container !== this.container) {
          wbState.connectNodes = []
          return
        } else startNode.lineTo(this)
      }
      if (wbState.showRightPage) wbState.showRightPage = false
      e.stopPropagation() // 保证不冒泡选择到外层节点
      if (!wbState.focusNodes.includes(this)) {
        // focus
        if (wbState.editNode) {
          wbState.editNode = undefined
        }
        if (!hotKey.MetaLeft) {
          wbState.focusNodes = [this]
        } else {
          wbState.focusNodes.push(this)
        }
      }
      if (!wbState.dragNode !== this && this.nodeData.type !== 'line')
        wbState.dragNode = this // drag
    },
    move(movement) {
      const scale = getSVGScale(this.container.svg)
      this.nodeData.bounds.x += movement.x * scale
      this.nodeData.bounds.y += movement.y * scale
    },
    // 聚焦节点跟随主拖拽节点移动，此时相当于这个拖拽节点是所有聚焦节点的controller，控制流：root-board -> dragNode -> focusNodes
    onDrag(movement) {
      wbState.focusNodes.forEach(node => {
        node.move(movement)
      })
    },
    // 双击进入编辑状态
    onDblclick(e) {
      console.log('db')
      if (
        this.$componentsConfig[`moa-${this.nodeData.type}`].editable === false
      )
        return
      wbState.editNode = this
    },
    onDelete() {
      const nodes = this.container.nodeData.panelData.chartData
      nodes.remove(this.nodeData, ...this._inLines, ...this._outLines)
    }
  },
  props: {
    nodeData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-node {
  &__focus-border {
    pointer-events: none;
  }
}
</style>