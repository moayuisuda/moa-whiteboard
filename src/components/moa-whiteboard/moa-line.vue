<template>
  <g>
    <path
      class="line--to"
      :d="_d"
      fill="none"
      :stroke="$color['line']"
      stroke-width="3"
      stroke-linecap="round"
    />
    <path
      @click.stop="onFocus"
      class="line--to"
      :d="_d"
      fill="none"
      stroke="transparent"
      stroke-width="20"
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
    return {}
  },
  inject: ['container'],
  computed: {
    _isFocus() {
      return wbState.focusLine === this
    },
    _d() {
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
      console.log('in')
      wbState.focusLine = this
    },
    onDelete() {
      this.container.lines.splice(
        this.container.lines.indexOf(this.lineData),
        1
      )
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
