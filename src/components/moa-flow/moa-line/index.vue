<template>
  <path :d="_d" stroke=#8E8E8E stroke-width=4 stroke-linecap="round" />
</template>

<script>
// 线的两端距离结点的距离
const margin = 10

export default {
  name: 'moa-line',
  data() {
    return {
      
    }
  },
  computed: {
    _d() {
      return `M${this._x1} ${this._y1} L${this._x2} ${this._y2}`
    },
    _x1() {
      const {
        start: {
          node: { bounds },
          direction,
        },
      } = this.lineData
      switch (direction) {
        case 'l':
          return bounds.x - margin
        case 'r':
          return bounds.x + bounds.w + margin
        default:
          return bounds.x + bounds.w / 2
      }
    },
    _y1() {
      const {
        start: {
          node: { bounds },
          direction,
        },
      } = this.lineData
      switch (direction) {
        case 't':
          return bounds.y - margin
        case 'b':
          return bounds.y + bounds.h + margin
        default:
          return bounds.y + bounds.h / 2
      }
    },
    _x2() {
      console.log(this.lineData)
      const {
        end: {
          node: { bounds },
          direction,
        },
      } = this.lineData
      switch (direction) {
        case 'l':
          return bounds.x - margin
        case 'r':
          return bounds.x + bounds.w + margin
        default:
          return bounds.x + bounds.w / 2
      }
    },
    _y2() {
      const {
        end: {
          node: { bounds },
          direction,
        },
      } = this.lineData
      switch (direction) {
        case 't':
          return bounds.y - margin
        case 'b':
          return bounds.y + bounds.h + margin
        default:
          return bounds.y + bounds.h / 2
      }
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

<style lang="scss" scoped></style>
