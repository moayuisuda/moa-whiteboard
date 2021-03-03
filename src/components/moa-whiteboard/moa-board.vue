<template>
  <g
    @wheel.stop="onWheel"
    @mouseover.stop="onMouseEnter"
  >
    <!-- 边框样式 -->
    <rect
      :rx="$style['radius']"
      :ry="$style['radius']"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      :fill="$color['background']"
      :stroke="_stroke"
      :stroke-width="$style['stroke-width']"
    />
    <svg
      class="moa-whiteboard"
      ref="svg"
      :width="bounds.w"
      :height="bounds.h"
      :viewBox="_viewBox"
    >
      <moa-line
        v-for="lineData in lines"
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
import { eventBus, hotKey, wbState } from '~/state'
import { getCoords } from '~/utils/coords'

const zoomMin = 0.3
const zoomMax = 4
const moveSpeed = 1
const zoomSpeed = 0.002

export default {
  name: 'moa-board',
  provide: function() {
    return this.isRoot
      ? {
          container: this,
          root: this,
          panelData: this.panelData
        }
      : {
          container: this
        }
  },
  data() {
    return {
      panelData: this.nodeData.panelData,
      panelOps: this.nodeData.panelData.panelOps,
      bounds: this.nodeData.bounds,
      nodes: [],
      lines: [],
      onCmd: false,
      cache: {
        nodes: [],
        lines: []
      }
    }
  },
  mounted() {
    this.parseData()
    this.initChart()
  },
  computed: {
    _isShowPreAddNode() {
      return wbState.preAddNode && wbState.cursorBoard === this
    },
    _stroke() {
      return this.isRoot ? 'none' : this.$color['line']
    },
    _viewBox() {
      return `${this.panelOps.x} ${this.panelOps.y} ${this.bounds.w /
        this.panelOps.zoom} ${this.bounds.h / this.panelOps.zoom}`
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
        bounds: {
          x: 0,
          y: 0,
          w: 400,
          h: 400
        }
      }
    },
    onMouseEnter() {
      wbState.cursorBoard = this
    },
    onWheel(e) {
      if (hotKey.MetaLeft) {
        const oldCoords = getCoords(this.svg, this.pt, e)
        this.panelOps.zoom = this.panelOps.zoom + e.deltaY * zoomSpeed

        if (this.panelOps.zoom <= zoomMin) this.panelOps.zoom = zoomMin
        if (this.panelOps.zoom >= zoomMax) this.panelOps.zoom = zoomMax

        this.svg.setAttribute('viewBox', this._viewBox)
        const newCoords = getCoords(this.svg, this.pt, e)
        this.panelOps.x -= newCoords.x - oldCoords.x
        this.panelOps.y -= newCoords.y - oldCoords.y
      } else {
        this.panelOps.x += (e.deltaX * moveSpeed) / this.panelOps.zoom
        this.panelOps.y += (e.deltaY * moveSpeed) / this.panelOps.zoom
      }
    },
    initChart() {
      this.svg = this.$refs['svg']
      this.pt = this.svg.createSVGPoint()

      if (this.isRoot) {
        this.svg.addEventListener('wheel', this.onWheel)
      }
    },
    parseData() {
      const { chartData } = this.panelData

      for (let node of chartData) {
        if (this.cache[node.id])
          throw `[moa-whiteboard] The node's id in a flow must be unique.`
        this.cache[node.id] = node
      }

      this.nodes = chartData

      for (let startNodeData of chartData) {
        if (startNodeData.lineTo) {
          for (let endNodeDataId of startNodeData.lineTo) {
            this.lines.push({
              startNodeData,
              endNodeData: this.cache[endNodeDataId]
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
