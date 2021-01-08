<template>
  <g
    @mousedown.stop="onMousedown"
    @click.stop
    :transform="_transform"
    :class="`moa-node node-${nodeData.id}`"
    :stroke-width="2"
  >
    <!-- 如果是子图表，则递归渲染 -->
    <g v-if="nodeData.panelData" @wheel.stop="onWheel">
      <rect
        rx="6"
        ry="6"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
        :fill="$color['background']"
        :stroke="$color['line']"
      />
      <moa-board
        ref="childFlow"
        :isRoot="false"
        :panelData="nodeData.panelData"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
      />
    </g>
    <!-- 如果不是子图表则直接渲染对应结点 -->
    <g v-else>
      <component :is="`moa-${nodeData.style.shape}`" :nodeData="nodeData" />
    </g>
  </g>
</template>

<script>
import { getCoords, getSVGScale } from '@/utils/coords'
import { eventBus, wbState } from '@/state'
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
    _transform() {
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    },
  },
  methods: {
    onWheel(e) {
      this.$refs['childFlow'].onWheel(e)
    },
    onMousedown(e) {
      if(!wbState.focusNodes.includes(this)) eventBus.$emit('focus', this)
      if(!wbState.dragNode !== this) eventBus.$emit('drag', this)
    },
    move(movement) {
      const scale = getSVGScale(this.container.svg)
      this.nodeData.bounds.x += movement.x * scale
      this.nodeData.bounds.y += movement.y * scale
    },
    // 聚焦节点跟随主拖拽节点移动，此时相当于这个拖拽节点是所有聚焦节点的controller，控制流：root-board -> dragNode -> focusNodes
    onDrag(movement) {
      wbState.focusNodes.forEach((node) => {
        node.move(movement)
      })
    },
  },
  props: {
    nodeData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-node {
  transform: filter 0.2s;
}
</style>
