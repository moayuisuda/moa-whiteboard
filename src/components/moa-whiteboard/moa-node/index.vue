<template>
  <g
    @mousedown.stop="onMousedown"
    @click.stop
    :transform="_transform"
    :style="{
      filter: `url(#${_isFocus ? 'focus' : 'dropshadow'})`,
    }"
    :class="`moa-node node-${nodeData.id}`"
  >
    <!-- 如果是子图表，则递归渲染 -->
    <g v-if="nodeData.panelData" @wheel.stop="onWheel">
      <rect
        rx="6"
        ry="6"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
        :fill="$color['background']"
        stroke=""
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
    <component v-else :is="`moa-${nodeData.style.shape}`" :nodeData="nodeData" />
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
    return {
      isDrag: false,
    }
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
      eventBus.$emit('focus', this)
      eventBus.$emit('drag', this)
      this.isDrag = true
      this.movePoint = getCoords(this.container.svg, this.container.pt, e)
    },
    onMousemove(movement) {
      if (this.isDrag) {
        wbState.focusNodes.forEach((node) => (node.isDrag = true))
        const scale = getSVGScale(this.container.svg)
        this.nodeData.bounds.x += movement.x * scale
        this.nodeData.bounds.y += movement.y * scale
      }
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
  created() {
    eventBus.$on('mouseup', this.releaseDrag)
    eventBus.$on('mousemove', this.onMousemove)
  },
  beforeDestroy() {
    eventBus.$off('mouseup', this.releaseDrag)
    eventBus.$off('mousemove', this.onMousemove)
  },
}
</script>

<style lang="scss" scoped>
.moa-node {
  transform: filter 0.2s;
}
</style>
