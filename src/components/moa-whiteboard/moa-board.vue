<template>
  <g
    @wheel.stop="onWheel"
    @mouseover.stop="onMouseEnter"
  >
    <!-- 边框样式 -->
    <rect
      @click="onBackClick"
      :rx="$style['radius']"
      :ry="$style['radius']"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      :fill="$color['background']"
      :stroke="_stroke"
      :stroke-width="$style['stroke-width']"
    />
    <foreignObject
      y=-30
      v-if="!isRoot"
    >
      <input
        v-model="nodeData.model.title"
        type="text"
        @click.stop
        class="moa-board__title"
      >
    </foreignObject>
    <svg
      class="moa-board"
      ref="svg"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      :viewBox="_viewBox"
    >
      <moa-line
        v-for="lineData in _lines"
        :key="lineData.id"
        :lineData="lineData"
      ></moa-line>
      <moa-node
        v-for="nodeData in nodes"
        :key="nodeData.id"
        :nodeData="nodeData"
      ></moa-node>
      <moa-node
        v-if="_isShowPreAddNode"
        :nodeData="$wbState.preAddNode"
      ></moa-node>
    </svg>
  </g>
</template>

<script>
import { hotKey, wbState } from '~/state'
import { getCoords, getSVGScale } from '~/utils/coords'

const zoomMin = 0.3
const zoomMax = 4
const moveSpeed = 1
const zoomSpeed = 0.002

export default {
  name: 'moa-board',
  isBoardCmp: true,
  provide: function() {
    return this.isRoot
      ? {
          container: this,
          root: this
        }
      : {
          container: this
        }
  },
  data() {
    return {
      editable: false,
      nodes: [],
      onCmd: false,
      cache: {
        nodes: [],
        lines: []
      }
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
  },
  computed: {
    _isShowPreAddNode() {
      return wbState.preAddNode && wbState.cursorBoard === this
    },
    _stroke() {
      return this.isRoot ? 'none' : this.$color['line']
    },
    _viewBox() {
      return `${this.nodeData.panelData.panelOps.x} ${
        this.nodeData.panelData.panelOps.y
      } ${this.nodeData.bounds.w / this.nodeData.panelData.panelOps.zoom} ${this
        .nodeData.bounds.h / this.nodeData.panelData.panelOps.zoom}`
    },
    _lines() {
      const { chartData } = this.nodeData.panelData
      const cache = {}
      const lines = []

      for (let node of chartData) {
        if (cache[node.id]) {
          throw `[moa-whiteboard] The node's id in a flow must be unique.`
        }
        cache[node.id] = node
      }

      this.nodes = chartData

      for (let startNodeData of chartData) {
        if (startNodeData.lineTo) {
          for (let endNodeDataId of startNodeData.lineTo) {
            lines.push({
              startNodeData,
              endNodeData: cache[endNodeDataId]
            })
          }
        }
      }

      return lines
    }
  },
  props: {
    isRoot: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    getDefaultData() {
      return {
        type: 'board',
        panelData: {
          panelOps: {
            zoom: 0.5,
            x: 0,
            y: 0
          },
          chartData: []
        },
        model: {
          title: 'child flow'
        },
        bounds: {
          x: 0,
          y: 0,
          w: 400,
          h: 400
        }
      }
    },
    onBackClick(e) {
      if (wbState.editBoard[wbState.editBoard.length - 1] === this) {
        wbState.focusNodes = []
        wbState.editNode = undefined
        wbState.focusLine = undefined
      }
    },
    onMouseEnter() {
      wbState.cursorBoard = this
    },
    onMove(movement) {
      const scale = getSVGScale(this.svg)
      this.nodeData.panelData.panelOps.x -= movement.x * scale
      this.nodeData.panelData.panelOps.y -= movement.y * scale
    },
    onWheel(e) {
      if (hotKey.MetaLeft) {
        const oldCoords = getCoords(this.svg, this.pt, e)
        this.nodeData.panelData.panelOps.zoom =
          this.nodeData.panelData.panelOps.zoom + e.deltaY * zoomSpeed

        if (this.nodeData.panelData.panelOps.zoom <= zoomMin)
          this.nodeData.panelData.panelOps.zoom = zoomMin
        if (this.nodeData.panelData.panelOps.zoom >= zoomMax)
          this.nodeData.panelData.panelOps.zoom = zoomMax

        this.svg.setAttribute('viewBox', this._viewBox)
        const newCoords = getCoords(this.svg, this.pt, e)
        this.nodeData.panelData.panelOps.x -= newCoords.x - oldCoords.x
        this.nodeData.panelData.panelOps.y -= newCoords.y - oldCoords.y
      } else {
        this.nodeData.panelData.panelOps.x +=
          (e.deltaX * moveSpeed) / this.nodeData.panelData.panelOps.zoom
        this.nodeData.panelData.panelOps.y +=
          (e.deltaY * moveSpeed) / this.nodeData.panelData.panelOps.zoom
      }
    },
    initChart() {
      this.svg = this.$refs['svg']
      this.pt = this.svg.createSVGPoint()

      if (this.isRoot) {
        this.svg.addEventListener('wheel', this.onWheel)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.moa-board {
  &__title {
    font-size: 20px;
    border: none;
    background-color: transparent;
    font-weight: bold;
  }
}
</style>
