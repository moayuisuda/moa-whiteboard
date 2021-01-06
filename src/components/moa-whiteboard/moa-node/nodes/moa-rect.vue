<template>
  <g>
    <rect
      :fill="_fill"
      :stroke="_stroke"
      stroke-dasharray="10 10"
      stroke-width="3"
      rx="6"
      ry="6"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
    />
    <text
      :fill="$color['text-color']"
      text-anchor="middle"
      dominant-baseline="middle;"
      :x="nodeData.bounds.w / 2"
      :y="nodeData.bounds.h / 2"
      >{{ nodeData.text }}</text
    >
  </g>
</template>

<script>
import { hexToRgb } from '@/utils/style'
const alpha = 0.55

export default {
  name: 'moa-rect',
  data() {
    return {}
  },
  computed: {
    _fill() {
      const { style } = this.nodeData
      const { _styleColor } = this

      if (style.border === 'none') {
        return _styleColor
      } else {
        const rgb = hexToRgb(_styleColor)
        return `rgb(${(1 - alpha) * 255 + rgb.r}, ${(1 - alpha) * 255 + rgb.g}, ${(1 - alpha) * 255 + rgb.b})`
      }
    },
    _stroke() {
      const { style } = this.nodeData
      const { _styleColor } = this

      if (style.border === 'none') {
        return 'transparent'
      } else {
        const rgb = hexToRgb(_styleColor)
        return _styleColor
      }
    },
    _styleColor() {
      return this.nodeData.style.color || '#ffffff'
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

<style lang="scss" scoped></style>
