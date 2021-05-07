<template>
  <g>
    <!-- <path
      v-if="lineData.model.type === 'arrow'"
      :d="polygon"
      fill="none"
      stroke-width="2"
      stroke="none"
      stroke-linecap="round"
    /> -->
    <g
      v-if="lineData.model.type === 'bezier'"

    >
      <path
        :class="{'line--dash': lineData.model.style === 'dash'}"
        :d="_d"
        fill="none"
        stroke-width="3"
        :stroke="$color['line']"
        stroke-linecap="round"
      />
      <path
        ref="path"
        @dblclick.stop="onEdit"
        @mousedown="onMousedown"
        :d="_d"
        fill="none"
        stroke="transparent"
        stroke-width="10"
        stroke-linecap="round"
      />
      <!-- <image
      @click="$emit('delete')"
      v-if="isFocus"
      :x="(_x1 + _x2) / 2 - 10"
      :y="(_y1 + _y2) / 2 - 10"
      width="20"
      height="20"
      xlink:href="./assets/close.svg"
    ></image> -->
    </g>
  </g>
</template>

<script>
import { eventBus, wbState } from '~/state'
// 线的两端距离结点的距离

export default {
  name: 'moa-line',
  isBoardCmp: true,
  editable: true,
  data() {
    return {
      // polygon: ''
    }
  },
  inject: ['container'],
  watch: {
    'lineData.model.type': {
      handler() {
        console.log(this.lineData.model.type)
        if (this.lineData.model.type === 'arrow') {
          this.$nextTick(() => {
            this.polygon = this.getPath()
          })
        }
      },
      immediate: true
    },
    _d: {
      handler() {
        if (this.lineData.model.type === 'arrow') {
          this.polygon = this.getPath()
        }
      }
    }
  },
  computed: {
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
      const { _startBounds } = this
      const { startP } = this.lineData
      let value
      if (startP === 'left') value = _startBounds.x
      else if (startP === 'right') value = _startBounds.x + _startBounds.w
      else value = _startBounds.x + _startBounds.w / 2
      return value
    },
    _y1() {
      const { _startBounds } = this
      const { startP } = this.lineData
      let value
      if (startP === 'top') value = _startBounds.y
      else if (startP === 'bottom') value = _startBounds.y + _startBounds.h
      else value = _startBounds.y + _startBounds.h / 2
      return value
    },
    _x2() {
      const { _endBounds } = this
      const { endP } = this.lineData
      let value
      if (endP === 'left') value = _endBounds.x
      else if (endP === 'right') value = _endBounds.x + _endBounds.w
      else value = _endBounds.x + _endBounds.w / 2
      return value
    },
    _y2() {
      const { _endBounds } = this
      const { endP } = this.lineData
      let value
      if (endP === 'top') value = _endBounds.y
      else if (endP === 'bottom') value = _endBounds.y + _endBounds.h
      else value = _endBounds.y + _endBounds.h / 2
      return value
    },
    _startBounds() {
      const start = this.lineData.start
      if (typeof start !== 'string') return start
      return this.container._nodeMap[this.lineData.start].bounds
    },
    _endBounds() {
      const end = this.lineData.end
      if (typeof end !== 'string') return end
      return this.container._nodeMap[this.lineData.end].bounds
    }
  },
  props: {
    lineData: {
      type: Object,
      default() {
        return {}
      }
    },
    isFocus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getPath() {
      const pathDom = this.$refs['path']

      let d = `M${this._x1},${this._y1}`
      let p
      const l = pathDom.getTotalLength()
      for (let i = 20; i < l; i += 20) {
        p = pathDom.getPointAtLength((i / l) * pathDom.getTotalLength())
        d += ` L${p.x},${p.y}`
      }

      return d
    },
    getDefaultData() {
      return {
        type: 'line',
        model: {
          type: 'bezier',
          style: 'stroke',
          arrow: 'true'
        },
        start: '',
        end: '',
        startP: 'right',
        endP: 'left'
      }
    },
    onEdit() {
      this.$emit('edit')
    },
    onMousedown(e) {
      this.$emit('path-click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.line--dash {
  stroke-dasharray: 10 10;
}
</style>
