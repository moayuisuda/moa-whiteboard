<template>
  <g
    :class="{ 'moa-line--drag': _dots.includes($wbState.dragDot) }"
    :stroke="$color['line']"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="3"
    fill="none"
  >
    <path
      :marker-end="_marker"
      :class="{'line--dash': lineData.model.style === 'dash'}"
      v-if="lineData.model.type === 'group'"
      :d="_d"
    />
    <g v-if="lineData.model.type === 'bezier'">
      <path
        :marker-end="_marker"
        :class="{'line--dash': lineData.model.style === 'dash'}"
        :d="_d"
      />
    </g>
    <path
      ref="path"
      @dblclick.stop="onEdit"
      @mousedown="onMousedown"
      :d="_d"
      stroke="transparent"
      stroke-width="10"
    />
    <g v-if="isFocus || $wbState.preAddNode === lineData">
      <circle
        class="moa-line_dot"
        v-for="(dot, index) in _dots"
        @mousedown.stop.prevent="onDotMousedown($event, dot, index)"
        :cx="dot.coords.x"
        :cy="dot.coords.y"
        r=10
        stroke="none"
        :fill="$color['main']"
        :key="index"
      />
    </g>
  </g>
</template>

<script>
import { eventBus, wbState } from '~/state'
import { getPoints, getSVGScale, getCoords } from '~/utils/coords'
const MARGIN = 10
// 线的两端距离结点的距离

export default {
  name: 'moa-line',
  isBoardCmp: true,
  editable: true,
  data() {
    return {
      // polygon: ''
      points: [],
      onDragMove: false
    }
  },
  inject: ['container'],
  computed: {
    _marker() {
      if (this.lineData.model.arrow === 'true') return 'url(#arrow)'
      else return ''
    },
    _dots() {
      const re = []
      if (typeof this.lineData.start === 'string')
        re.push({ coords: { x: this._x1, y: this._y1 }, anchor: 'start' })
      else re.push(this.lineData.start)

      if (this.lineData.model.type === 'group') {
        for (let p of this.lineData.points) {
          re.push({ coords: p })
        }
      }

      if (typeof this.lineData.end === 'string')
        re.push({ coords: { x: this._x2, y: this._y2 }, anchor: 'end' })
      else re.push(this.lineData.end)

      return re
    },
    _d() {
      if (this.lineData.model.type === 'group') {
        let re = `M${this._dots[0].coords.x},${this._dots[0].coords.y}`
        for (let i = 1; i < this._dots.length; i++) {
          const dot = this._dots[i]
          re += ` L${dot.coords.x},${dot.coords.y}`
        }
        return re
      } else {
        const length = Math.abs(this._x1 - this._x2) * 0.6
        if (this._x1 < this._x2) {
          return `M${this._x1},${this._y1} C${this._x1 + length},${
            this._y1
          } ${this._x2 - length},${this._y2} ${this._x2},${this._y2}`
        } else
          return `M${this._x1},${this._y1} C${this._x1 - length},${
            this._y1
          } ${this._x2 + length},${this._y2} ${this._x2},${this._y2}`
      }
    },
    _x1() {
      const { _startBounds } = this
      const { startP, start } = this.lineData
      const ifLinkNode = typeof start === 'string'
      let value
      if (startP === 'left') value = _startBounds.x - (ifLinkNode ? MARGIN : 0)
      else if (startP === 'right')
        value = _startBounds.x + _startBounds.w + (ifLinkNode ? MARGIN : 0)
      else value = _startBounds.x + _startBounds.w / 2
      return value
    },
    _y1() {
      const { _startBounds } = this
      const { startP, start } = this.lineData
      const ifLinkNode = typeof start === 'string'
      let value
      if (startP === 'top') value = _startBounds.y - (ifLinkNode ? MARGIN : 0)
      else if (startP === 'bottom')
        value = _startBounds.y + _startBounds.h + (ifLinkNode ? MARGIN : 0)
      else value = _startBounds.y + _startBounds.h / 2
      return value
    },
    _x2() {
      const { _endBounds } = this
      const { endP, end } = this.lineData
      const ifLinkNode = typeof end === 'string'
      let value
      if (endP === 'left') value = _endBounds.x - (ifLinkNode ? MARGIN : 0)
      else if (endP === 'right')
        value = _endBounds.x + _endBounds.w + (ifLinkNode ? MARGIN : 0)
      else value = _endBounds.x + _endBounds.w / 2
      return value
    },
    _y2() {
      const { _endBounds } = this
      const { endP, end } = this.lineData
      const ifLinkNode = typeof end === 'string'
      let value
      if (endP === 'top') value = _endBounds.y - (ifLinkNode ? MARGIN : 0)
      else if (endP === 'bottom')
        value = _endBounds.y + _endBounds.h + (ifLinkNode ? MARGIN : 0)
      else value = _endBounds.y + _endBounds.h / 2
      return value
    },
    _startBounds() {
      const start = this.lineData.start
      if (typeof start !== 'string') return start.coords
      return this.container._nodeMap[this.lineData.start].bounds
    },
    _endBounds() {
      const end = this.lineData.end
      if (typeof end !== 'string') return end.coords
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
    },
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleDot(index) {},
    onDotMousedown(e, dot, index) {
      if (this.lineData.model.type === 'group' && e.which === 3) {
        this.lineData.points.splice(index - 1, 1)
        return
      }

      this.$emit('drag-start')
      const coords = getCoords(this.container.svg, this.container.pt, e)
      if (dot.anchor) {
        this.lineData[dot.anchor] = {
          coords: {
            x: coords.x,
            y: coords.y,
            w: 0,
            h: 0
          },
          anchor: dot.anchor
        }
        this.lineData[`${dot.anchor}P`] = ''

        if (dot.anchor === 'end')
          wbState.dragDot = this._dots[this._dots.length - 1]
        else wbState.dragDot = this._dots[0]
      } else wbState.dragDot = dot
    },
    getDefaultData() {
      return {
        type: 'line',
        model: {
          type: 'bezier',
          style: 'stroke',
          arrow: 'true'
        },
        start: { coords: { x: 0, y: 0, w: 0, h: 0 }, anchor: 'start' },
        end: { coords: { x: 0, y: 0, w: 0, h: 0 }, anchor: 'end' },
        startP: '',
        endP: '',
        points: []
      }
    },
    onEdit() {
      this.$emit('edit')
    },
    onMousedown(e) {
      this.$emit('path-click', e)
      if (e.which === 3) return
      if (this.isFocus && this.lineData.model.type === 'group') {
        const coords = getCoords(this.container.svg, this.container.pt, e)
        const snapX = Math.round(coords.x / wbState.snap) * wbState.snap,
          snapY = Math.round(coords.y / wbState.snap) * wbState.snap

        let pre = this._dots[0]

        for (let i = 1; i < this._dots.length; i++) {
          let curr = this._dots[i]
          if (
            (pre.coords.x - coords.x) * (curr.coords.x - coords.x) < 2 &&
            (pre.coords.y - coords.y) * (curr.coords.y - coords.y) < 2
          ) {
            this.lineData.points.splice(i - 1, 0, {
              x: snapX,
              y: snapY
            })
            wbState.dragDot = this._dots[i]
          }

          pre = curr
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.line--dash {
  stroke-dasharray: 10 10;
}
.moa-line {
  &--drag {
    pointer-events: none;
  }
  &_dot {
    opacity: 0.5;
    cursor: move;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
