<template>
  <g>
    <path
      v-if="lineData.model.type === 'stroke' || lineData.model.type === 'dash'"
      :class="{'line--dash': lineData.model.type === 'dash'}"
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
      polygon: ''
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
  getDefaultData() {
    return {
      type: 'line',
      model: {
        type: 'bezier',
        dash: 'false',
        arrow: 'true'
      },
      start: '0',
      end: '2',
      startP: 'right',
      endP: 'left'
    }
  },
  computed: {
    _d() {},
    _x1() {
      const { bounds } = this._startNodeData
      return bounds.x + bounds.w / 2
    },
    _y1() {
      const { bounds } = this._startNodeData
      return bounds.y + bounds.h / 2
    },
    _x2() {
      const { bounds } = this._endNodeData
      return bounds.x + bounds.w / 2
    },
    _y2() {
      const { bounds } = this._endNodeData
      return bounds.y + bounds.h / 2
    },
    _startNodeData() {
      return this.container._nodeMap[this.lineData.start]
    },
    _endNodeData() {
      return this.container._nodeMap[this.lineData.end]
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
          type: 'stroke'
        },
        start: '',
        end: ''
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
