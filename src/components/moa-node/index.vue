<template>
  <!-- 如果是子流程，则递归渲染 -->
  <g @wheel.stop="onWheel" v-if="nodeData.panelData" :transform="_transform">
    <rect
      rx="6"
      ry="6"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      fill="white"
      style="filter:url(#dropshadow)"
    />
    <moa-flow
      ref="childFlow"
      :class="`moa-node-${nodeData.id}`"
      :isRoot="false"
      :panelData="nodeData.panelData"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
    />
  </g>
  <!-- 如果不是子流程则直接渲染对应结点 -->
  <g :transform="_transform" :class="`moa-node-${nodeData.id}`" v-else>
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
</template>

<script>
import { hexToRgb } from '@/utils/style'

export default {
  name: 'moa-node',
  data() {
    return {}
  },
  mounted() {},
  computed: {
    _fill() {
      const { style } = this.nodeData
      if (style.border === 'none') {
        return style.color
      } else {
        const rgb = hexToRgb(style.color)
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
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
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    },
  },
  methods: {
    onWheel(e) {
      this.$refs['childFlow'].onWheel(e)
    }
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

<style lang="scss" scoped></style>
