<template>
  <path class="line--to" :d="_d" fill="none" :stroke="$color['line']" stroke-width="3" stroke-linecap="round" />
</template>

<script>
// 线的两端距离结点的距离

export default {
  name: 'moa-line',
  data() {
    return {}
  },
  computed: {
    _d() {
      const length = Math.abs(this._x1 - this._x2) * 0.6
      if (this._x1 < this._x2) {
        return `M${this._x1},${this._y1} C${this._x1 + length},${this._y1} ${this._x2 - length},${this._y2} ${this._x2},${this._y2}`
      } else return `M${this._x1},${this._y1} C${this._x1 - length},${this._y1} ${this._x2 + length},${this._y2} ${this._x2},${this._y2}`
    },
    _x1() {
      const {
        startNode: { bounds },
      } = this.lineData
      return bounds.x + bounds.w / 2
    },
    _y1() {
      const {
        startNode: { bounds },
      } = this.lineData
      return bounds.y + bounds.h / 2
    },
    _x2() {
      const {
        endNode: { bounds },
      } = this.lineData
      return bounds.x + bounds.w / 2
    },
    _y2() {
      const {
        endNode: { bounds },
      } = this.lineData
      return bounds.y + bounds.h / 2
    },
  },
  props: {
    lineData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
</style>
