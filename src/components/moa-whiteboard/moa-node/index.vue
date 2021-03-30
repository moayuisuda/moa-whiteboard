<template>
  <g
    @mousedown.prevent="onMousedown"
    @dblclick.stop="onDblclick"
    @click.prevent="onClick"
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
      :dots-show="!_isEdit && _isFocus"
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
</template>

<script>
import { getCoords, getSVGScale } from '~/utils/coords'
import { eventBus, wbState, hotKey } from '~/state'
const moveThreshold = 10

export default {
  name: 'moa-node',
  inject: ['container', 'root'],
  data() {
    return {}
  },
  computed: {
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
    onClick(e) {
      if (!wbState.preAddNode) e.stopPropagation()
      if (wbState.connectNodes.length === 1) {
        const startNode = wbState.connectNodes[0]
        if (startNode === this) return
        if (startNode.container !== this.container) return
        else startNode.lineTo(this)
      }
    },
    lineTo(des) {
      if (!this.nodeData.lineTo) this.nodeData.lineTo = []
      this.nodeData.lineTo.push(des.nodeData.id)
      this.container.lines.push({
        startNodeData: this.nodeData,
        endNodeData: des.nodeData
      })
      wbState.connectNodes = []
    },
    onMousedown(e) {
      if (wbState.preAddNode) {
        return
      }
      e.stopPropagation()
      if (!wbState.focusNodes.includes(this)) { // focus
        if (wbState.editNode) {
          wbState.editNode = undefined
        }
        if (!hotKey.MetaLeft) {
          wbState.focusNodes = [this]
        } else {
          wbState.focusNodes.push(this)
        }
      }
      if (!wbState.dragNode !== this) wbState.dragNode = this // drag
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
      wbState.editNode = this
    },
    onDelete() {
      this.container.nodes.splice(
        this.container.nodes.indexOf(
          this.container.nodes.find(nodeData => nodeData === this.nodeData)
        ),
        1
      )
      this.container.lines = this.container.lines.filter(line => {
        return (
          line.startNodeData !== this.nodeData &&
          line.endNodeData !== this.nodeData
        )
      })
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


base: 127.0.0.1 //
{
  kv_index: /
}