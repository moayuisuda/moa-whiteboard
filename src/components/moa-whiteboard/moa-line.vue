<template>
  <g>
    <path
      class="line--to"
      :d="polygon"
      fill="none"
      marker-mid="url(#arrow)"
      stroke-width="2"
      stroke="transparent"
      stroke-linecap="round"
    />
    <path
      ref="path"
      @click.stop="onFocus"
      class="line--to"
      :d="_d"
      fill="none"
      stroke="transparent"
      stroke-width="2"
      stroke-linecap="round"
    />
    <image
      v-if="_isFocus"
      @click="onDelete"
      :x="(_x1 + _x2) / 2"
      :y="(_y1 + _y2) / 2"
      width="20"
      height="20"
      xlink:href="./assets/close.svg"
    ></image>
  </g>
</template>

<script>
import { eventBus, wbState } from '~/state'
// 线的两端距离结点的距离

export default {
  name: 'moa-line',
  data() {
    return {
      polygon: ''
    }
  },
  inject: ['container'],
  computed: {
    _isFocus() {
      return wbState.focusLine === this
    },
    _d() {
      this.$nextTick(() => {
        const pathDom = this.$refs['path']

        let d = `M${this._x1},${this._y1}`
        let p
        const l = pathDom.getTotalLength()
        for (let i = 20; i < l; i += 20) {
          p = pathDom.getPointAtLength((i / l) * pathDom.getTotalLength())
          d += ` L${p.x},${p.y}`
        }

        this.polygon = d
      })

      const length = Math.abs(this._x1 - this._x2) * 0.6
      if (this._x1 < this._x2) {
        return `M${this._x1},${this._y1} C${this._x1 + length},${
          this._y1
        } ${this._x2 - length},${this._y2} ${this._x2},${this._y2}`
      } else
        return `M${this._x1},${this._y1} C${this._x1 - length},${
          this._y1
        } ${this._x2 + length},${this._y2} ${this._x2},${this._y2}`
    },
    _x1() {
      const {
        startNodeData: { bounds }
      } = this.lineData
      return bounds.x + bounds.w / 2
    },
    _y1() {
      const {
        startNodeData: { bounds }
      } = this.lineData
      return bounds.y + bounds.h / 2
    },
    _x2() {
      const {
        endNodeData: { bounds }
      } = this.lineData
      return bounds.x + bounds.w / 2
    },
    _y2() {
      const {
        endNodeData: { bounds }
      } = this.lineData
      return bounds.y + bounds.h / 2
    }
  },
  props: {
    lineData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    onFocus() {
      wbState.focusLine = this
    },
    onDelete() {
      this.lineData.startNodeData.lineTo.splice(
        this.lineData.startNodeData.lineTo.indexOf(this.endNodeData),
        1
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.line--to {
  pointer-events: all;
}
</style>
