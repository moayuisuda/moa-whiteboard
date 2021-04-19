<template>
  <g>
    <rect
      :fill="_fill"
      :stroke="_stroke"
      stroke-dasharray="10 10"
      stroke-width="2"
      :rx="$style['radius']"
      :ry="$style['radius']"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
    />
    <moa-input
      ref="input"
      :isEdit="isEdit"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      @input="onInput"
      @size-change="onSizeChange"
      @align-change="onAlignChange"
      @compositionend="onCompositionend"
      :size="nodeData.model.size"
      :align="nodeData.model.align"
      v-model="nodeData.model.value"
    />
  </g>
</template>

<script>
import { hexToRgb } from '~/utils/style'
const alpha = 0.55

export default {
  name: 'moa-basic',
  isBoardCmp: true,
  data() {
    return {
      editable: true
    }
  },
  mounted() {},
  methods: {
    getDefaultData() {
      return {
        type: 'basic',
        model: {
          value: '',
          align: 'center',
          shape: 'rect',
          border: 'none',
          color: '#ffffff'
        },
        bounds: {
          x: 0,
          y: 0,
          w: 150,
          h: 150
        }
      }
    },
    onCompositionend(e) {},
    recaculateHeight(height) {
      this.$nextTick(() => {
        const newHeight = this.$refs['input'].getNeedHeight()
        if (newHeight > this.nodeData.bounds.h) {
          this.nodeData.bounds.h = newHeight
        }
      })
    },
    onInput(value, e) {
      this.recaculateHeight()
    },
    onAlignChange(align) {
      this.nodeData.model.align = align
    },
    onSizeChange(size) {
      this.nodeData.model.size = size
      this.recaculateHeight()
    }
  },
  computed: {
    _fill() {
      const { model } = this.nodeData
      const { _styleColor } = this

      if (model.border === 'none') {
        return _styleColor
      } else {
        const rgb = hexToRgb(_styleColor)
        return `rgb(${(1 - alpha) * 255 + rgb.r}, ${(1 - alpha) * 255 +
          rgb.g}, ${(1 - alpha) * 255 + rgb.b})`
      }
    },
    _stroke() {
      const { model } = this.nodeData
      const { _styleColor } = this

      if (model.border === 'none') {
        return 'transparent'
      } else {
        const rgb = hexToRgb(_styleColor)
        return _styleColor
      }
    },
    _styleColor() {
      return this.nodeData.model.color
    }
  },
  props: {
    isFocus: Boolean,
    isEdit: Boolean,
    nodeData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
