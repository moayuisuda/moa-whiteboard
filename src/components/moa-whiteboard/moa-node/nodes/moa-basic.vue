<template>
  <g>
    <g
      :fill="_fill"
      :stroke="_stroke"
      stroke-dasharray="10 10"
      stroke-width="2"
    >
      <rect
        v-if="nodeData.model.shape === 'rect'"
        :rx="$style['radius']"
        :ry="$style['radius']"
        :width="nodeData.bounds.w"
        :height="nodeData.bounds.h"
      />
      <polygon
        v-if="nodeData.model.shape === 'diamond'"
        :points="_diamondPoints"
      />
      <ellipse
        v-if="nodeData.model.shape === 'ellipse'"
        :cx="nodeData.bounds.w/2"
        :cy="nodeData.bounds.h/2"
        :rx="nodeData.bounds.w/2"
        :ry="nodeData.bounds.h/2"
      />
    </g>
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
    <moa-pre-add v-if="isFocus" :nodeData="nodeData" @add="onAddNode" />
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
    onAddNode() {

    },
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
        },
        lineTo: []
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
    _diamondPoints() {
      const {
        nodeData: { bounds }
      } = this
      return `${bounds.w / 2},${0} ${bounds.w},${bounds.h / 2} ${bounds.w /
        2},${bounds.h} ${0},${bounds.h / 2}`
    },
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
