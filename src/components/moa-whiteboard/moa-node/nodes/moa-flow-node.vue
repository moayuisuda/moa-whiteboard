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
    <foreignObject :width="nodeData.bounds.w" :height="nodeData.bounds.h">
      <div class="text-container">
        <input v-model="nodeData.text" width="100%"/>
      </div>
    </foreignObject>
  </g>
</template>

<script>
import { hexToRgb } from '@/utils/style'
const alpha = 0.55

export default {
  name: 'moa-flow-node',
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

<style lang="scss" scoped>
.text-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;

  input {
    width: 100%;
    text-align: center;
  }
}
</style>
