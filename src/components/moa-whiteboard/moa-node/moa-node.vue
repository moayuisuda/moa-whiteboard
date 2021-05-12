<template>
  <g
    v-if="nodeData.type !== 'line'"
    :transform="_transform"
    :class="`moa-node node-${nodeData.id}`"
    @mouseenter="onAnchorHover = true"
    @mouseleave="onAnchorHover = false"
  >
    <g
      @mouseup="onMouseup"
      @mousedown="onMousedown"
      @dblclick="onDblclick"
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
        :dots-show="_isSelect"
      />
    </g>

    <moa-pre-add
      filter="url(#shadow)"
      @connect-start="onConnectStart"
      v-if="_isFocus && $wbState.selectNodes.length < 2"
      :nodeData="nodeData"
    />
    <moa-line-anchor
      filter="url(#shadow)"
      v-if="$wbState.dragDot && onAnchorHover"
      :nodeData="nodeData"
    />
  </g>

  <moa-line
    v-else
    :lineData="nodeData"
    @delete="dele"
    @path-click="onMousedown"
    @edit="onDblclick"
    @drag-start="onDragMove = true"
    :isEdit="_isEdit"
    :isFocus="_isFocus"
    :isSelect="_isSelect"
  />
</template>

<script>
import { getPoints, getSVGScale, getCoords } from '~/utils/coords'
import { move } from '~/utils/tween'
import { wbState, hotKey, eventBus } from '~/state'
import { v4 } from 'uuid'
const moveThreshold = 10

export default {
  name: 'moa-node',
  inject: ['container', 'root'],
  data() {
    return {
      onDragMove: false,
      onAnchorHover: false
    }
  },
  computed: {
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
    _isSelect() {
      return wbState.selectNodes.includes(this)
    },
    _isFocus() {
      return wbState.focusNode === this
    },
    _isEdit() {
      return wbState.editNode === this
    },
    _isDrag() {
      return wbState.dragNode === this
    },
    _transform() {
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    },
    _isLink() {
      return (
        typeof this.nodeData.start === 'string' &&
        typeof this.nodeData.end === 'string'
      )
    }
  },
  methods: {
    onConnectStart(dir) {
      const nodes = this.container.nodeData.panelData.chartData
      const lineData = this.$componentsConfig['moa-line'].defaultData()
      lineData.id = v4()
      lineData.start = this.nodeData.id
      lineData.startP = dir
      lineData.end = { coords: { x: 0, y: 0, w: 0, h: 0 }, anchor: 'end' }
      nodes.push(lineData)
      this.$nextTick(() => {
        const line = this.getNodeFromId(lineData.id)
        wbState.dragDot = lineData.end
        line.onDragMove = true
        wbState.selectNodes = [line]
        wbState.focusNode = line
      })
    },
    getNodeFromId(id) {
      for (let node of this.container.$children) {
        if (node.nodeData.id === id) return node
      }
    },
    moveBack() {
      const nodes = this.container.nodeData.panelData.chartData
      const { nodeData } = this
      const index = nodes.indexOf(nodeData)
      if (index === 0) return
      nodes.splice(index - 1, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveFront() {
      const nodes = this.container.nodeData.panelData.chartData
      const { nodeData } = this
      const index = nodes.indexOf(nodeData)
      if (index === nodes.length - 1) return
      nodes.splice(index + 1, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveToTop() {
      const nodes = this.container.nodeData.panelData.chartData
      const { nodeData } = this
      nodes.splice(nodes.length, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveToBottom() {
      const nodes = this.container.nodeData.panelData.chartData
      const { nodeData } = this
      nodes.splice(0, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    onConnect() {
      if (wbState.connectNodes.length !== 0) {
        wbState.connectNodes = []
      }
      wbState.connectNodes.push(this)
    },
    onMouseup() {},
    onMousedown(e) {
      if (wbState.preAddNode) {
        return
      }
      if (wbState.showRightPage) wbState.showRightPage = false
      else {
        if (e.which === 3) eventBus.$emit('show-right-page', e)
      }

      if (!wbState.selectNodes.includes(this)) {
        if (wbState.editNode) {
          wbState.editNode = undefined
        }
        if (
          (!hotKey.MetaLeft && !hotKey.AltLeft) ||
          wbState.selectNodes.find(node => {
            return node.container !== this.container
          })
        ) {
          wbState.selectNodes = [this]
        } else {
          wbState.selectNodes.push(this)

          const nodes = this.container.nodeData.panelData.chartData
          wbState.selectNodes.sort((a, b) => {
            return nodes.indexOf(a.nodeData) - nodes.indexOf(b.nodeData)
          })
        }
      }

      wbState.onBoard = this.container
      wbState.focusNode = this
      wbState.dragNode = this
      eventBus.$emit('drag-start', e)

      e.stopPropagation() // 保证不冒泡选择到外层节点
    },
    move(movement) {
      if (!this.nodeData.bounds) return // line
      this.nodeData.bounds.x += movement.x
      this.nodeData.bounds.y += movement.y
    },
    // 聚焦节点跟随主拖拽节点移动，此时相当于这个拖拽节点是所有聚焦节点的controller，控制流：root-board -> focusNode -> selectNodes
    onDrag(movement) {
      if (movement.x !== 0 || movement.y !== 0) {
        this.onDragMove = true
        wbState.selectNodes.forEach(node => {
          node.move(movement)
        })
      }
    },
    // 双击进入编辑状态
    onDblclick(e) {
      if (
        this.$componentsConfig[`moa-${this.nodeData.type}`].editable === false
      )
        return
      wbState.editNode = this
    },
    dele() {
      if (wbState.focusNode === this) wbState.focusNode = undefined
      if (wbState.selectNodes.includes(this))
        wbState.selectNodes.splice(wbState.selectNodes.indexOf(this), 1)
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