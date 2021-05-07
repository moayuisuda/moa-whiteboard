<template>
  <g
    v-if="nodeData.type !== 'line'"
    :transform="_transform"
    :class="`moa-node node-${nodeData.id}`"
  >
    <g
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
        :dots-show="_isFocus"
      />
    </g>
    <!-- 删除节点 -->
    <!-- <image
      v-if="!_isEdit && _isFocus"
      @click="dele"
      :x="nodeData.bounds.w - 25"
      y=10
      width="20"
      height="20"
      xlink:href="../assets/close.svg"
    ></image> -->
    <!-- 连线 -->
    <!-- <image
      v-if="!_isEdit && _isFocus"
      @click.stop="onConnect"
      :x="nodeData.bounds.w - 50"
      y=10
      width="20"
      height="20"
      xlink:href="../assets/connect.svg"
    ></image> -->

    <moa-pre-add
      filter="url(#shadow)"
      @connect-start="onConnectStart"
      v-if="_isFocus && $wbState.focusNodes.length < 2"
      :nodeData="nodeData"
    />
    <moa-line-anchor
      @mouseenter="onAnchorHover = true"
      @mouseleave="onAnchorHover = false"
      v-if="$wbState.connectNodes[0] && onAnchorHover"
      :nodeData="nodeData"
    />
  </g>

  <moa-line
    v-else
    :lineData="nodeData"
    @delete="dele"
    @path-click="onMousedown"
    @edit="onDblclick"
    :isEdit="_isEdit"
    :isFocus="_isFocus"
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
      dragStart: {},
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
    _isFocus() {
      return wbState.focusNodes.includes(this)
    },
    _isEdit() {
      return wbState.editNode === this
    },
    _isDrag() {
      return wbState.dragNode === this
    },
    _transform() {
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    }
  },
  methods: {
    onConnectStart() {
      console.log('link start!')
      const nodes = this.container.nodeData.panelData.chartData
      const lineData = this.$componentsConfig['moa-line'].defaultData()
      lineData.id = v4()
      lineData.start = this.nodeData.id
      lineData.end = {x: 0, y: 0, w: 0, h: 0}
      wbState.connectLine = lineData
      wbState.connectNodes[0] = this
      nodes.push(lineData)
    },
    resetDragStart() {
      this.dragStart.x = this.nodeData.bounds.x
      this.dragStart.y = this.nodeData.bounds.y
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
    snapTo(point) {
      const { bounds } = this.nodeData
      const {
        offset: { close }
      } = point
      const newBounds = {
        x: bounds.x + close.x - point.x,
        y: bounds.y + close.y - point.y
      }
      move(
        { x: bounds.x, y: bounds.y },
        { x: newBounds.x, y: newBounds.y },
        300,
        (values, pro, id) => {
          // if (this._isDrag) cancelAnimationFrame(id)
          bounds.x = values.x
          bounds.y = values.y
        }
      )
    },
    onConnect() {
      if (wbState.connectNodes.length !== 0) {
        wbState.connectNodes = []
      }
      wbState.connectNodes.push(this)
    },
    onMouseup() {
      if (!wbState.snap) return
      const points = getPoints(this.nodeData.bounds),
        snap = wbState.snap,
        pointsArr = []
      let point
      for (let key in points) {
        point = points[key]
        pointsArr.push(point)
        point.offset = {
          ox: point.x % snap,
          oy: point.y % snap,
          nx: Math.floor(point.x / snap),
          ny: Math.floor(point.y / snap),
          close: {}
        }

        let {
          offset,
          offset: { close }
        } = point

        // 默认距左上角最小
        close.x = offset.nx * snap
        close.y = offset.ny * snap
        if (offset.ox > snap / 2) close.x = (offset.nx + 1) * snap // 代表右
        if (offset.oy > snap / 2) close.y = (offset.ny + 1) * snap // 代表下

        close.dis = Math.sqrt(
          Math.pow(point.x - close.x, 2) + Math.pow(point.y - close.y, 2),
          2
        )
      }
      pointsArr.sort((a, b) => a.offset.close.dis - b.offset.close.dis)
      this.snapTo(pointsArr[0])
    },
    onMousedown(e) {
      if (wbState.preAddNode) {
        return
      }
      if (wbState.showRightPage) wbState.showRightPage = false
      e.stopPropagation() // 保证不冒泡选择到外层节点
      if (!wbState.focusNodes.includes(this)) {
        // focus
        if (wbState.editNode) {
          wbState.editNode = undefined
        }
        if (
          (!hotKey.MetaLeft && !hotKey.AltLeft) ||
          wbState.focusNodes.find(node => {
            return node.container !== this.container
          })
        ) {
          wbState.focusNodes = [this]
        } else {
          wbState.focusNodes.push(this)

          const nodes = this.container.nodeData.panelData.chartData
          wbState.focusNodes.sort((a, b) => {
            return nodes.indexOf(a.nodeData) - nodes.indexOf(b.nodeData)
          })
          for (let i of wbState.focusNodes) {
            console.log(i.nodeData.model.value)
          }
        }
      }
      if (wbState.dragNode !== this && this.nodeData.type !== 'line') {
        wbState.onBoard = this.container
        wbState.dragNode = this // drag
        wbState.focusNodes.forEach(node => {
          node.resetDragStart()
        })
        eventBus.$emit('drag-start', e)
      }
    },
    move(movement) {
      if (!this.nodeData.bounds) return // line
      this.nodeData.bounds.x = this.dragStart.x + movement.x
      this.nodeData.bounds.y = this.dragStart.y + movement.y
    },
    // 聚焦节点跟随主拖拽节点移动，此时相当于这个拖拽节点是所有聚焦节点的controller，控制流：root-board -> dragNode -> focusNodes
    onDrag(movement) {
      wbState.focusNodes.forEach(node => {
        node.move(movement)
      })
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