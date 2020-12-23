<template>
  <!-- 如果是子图表，则递归渲染 -->
  <g @mousedown.stop="onMousedown" @click="onClick" :transform="_transform" :class="`moa-node-${nodeData.id}`">
    <g @wheel.stop="onWheel" v-if="nodeData.panelData">
      <rect
        rx="6"
        ry="6"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
        fill="white"
        style="filter:url(#dropshadow)"
      />
      <moa-chart
        ref="childFlow"
        :class="`moa-node-${nodeData.id}`"
        :isRoot="false"
        :panelData="nodeData.panelData"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
      />
    </g>
    <!-- 如果不是子图表则直接渲染对应结点 -->
    <g v-else>
      <component
        style="filter:url(#dropshadow)"
        :is="`moa-${nodeData.style.shape}`"
        :nodeData="nodeData"
        :fill="_fill"
        :stroke="_stroke"
        stroke-dasharray="10 10"
        stroke-width="3"
      />
      <text text-anchor="middle" dominant-baseline="middle;" :x="nodeData.bounds.w / 2" :y="nodeData.bounds.h / 2">{{
        nodeData.text
      }}</text>
    </g>
    <!-- <path> -->
  </g>
</template>

<script>
import { getCoords } from '@/utils/coords'
import { hexToRgb } from '@/utils/style'
import { eventBus } from '../state'

const alpha = 0.4

export default {
  name: 'moa-node',
  inject: ['container', 'root'],
  data() {
    return {
      onDrag: false,
      bounds: this.nodeData.bounds,
      movePoint: {},
    }
  },
  computed: {
    _fill() {
      const { style } = this.nodeData
      if (style.border === 'none') {
        return style.color
      } else {
        const rgb = hexToRgb(style.color)
        return `rgb(${(1 - alpha) * 255 + rgb.r}, ${(1 - alpha) * 255 + rgb.g}, ${(1 - alpha) * 255 + rgb.b})`
      }
    },
    _stroke() {
      const { style } = this.nodeData
      if (style.border === 'none') {
        return 'transparent'
      } else {
        const rgb = hexToRgb(style.color)
        return style.color
      }
    },
    stroke() {},
    _transform() {
      return `translate(${this.bounds.x}, ${this.bounds.y})`
    },
  },
  methods: {
    releaseDrag() {
      this.onDrag = false
    },
    onMousedown(e) {
      this.onDrag = true
      this.movePoint = getCoords(this.container.svg, this.container.pt, e)
    },
    onMouseup(e) {
      this.onDrag = false
    },
    onMousemove(e) {
      if (this.onDrag) {
        const newMovePoint = getCoords(this.container.svg, this.container.pt, e)
        this.bounds.x += newMovePoint.x - this.movePoint.x
        this.bounds.y += newMovePoint.y - this.movePoint.y

        this.movePoint = newMovePoint
      }
    },
    onClick(e) {},
    onWheel(e) {
      this.$refs['childFlow'].onWheel(e)
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

<style lang="scss" scoped></style>
