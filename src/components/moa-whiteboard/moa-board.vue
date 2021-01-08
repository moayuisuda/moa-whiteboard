<template>
  <svg class="moa-whiteboard" ref="svg" :width="width" :height="height" :viewBox="_viewBox">
    <moa-line v-for="lineData in lines" :key="lineData.id" :lineData="lineData"></moa-line>
    <moa-node v-for="nodeData in nodes" :key="nodeData.id" :nodeData="nodeData"></moa-node>
  </svg>
</template>

<script>
import { eventBus, hotKey, wbState } from '@/state'
import { getCoords } from '@/utils/coords'

const zoomMin = 0.3
const zoomMax = 4
const moveSpeed = 1
const zoomSpeed = 0.002

export default {
  name: 'moa-board',
  provide: function() {
    return {
      container: this,
      [this.isRoot ? 'root' : 'container']: this,
    }
  },
  data() {
    return {
      panelOps: this.panelData.panelOps,
      nodes: [],
      lines: [],
      onCmd: false,
      cache: {
        nodes: [],
        lines: [],
      },
    }
  },
  mounted() {
    this.parseData()
    this.initChart()
  },
  computed: {
    _viewBox() {
      return `${this.panelOps.x} ${this.panelOps.y} ${this.width / this.panelOps.zoom} ${this.height /
        this.panelOps.zoom}`
    },
  },
  props: {
    isRoot: {
      type: Boolean,
      default: true,
    },
    panelData: {
      type: Object,
      default() {
        return {}
      },
    },
    width: {
      type: Number,
      default: 1080,
    },
    height: {
      type: Number,
      default: 720,
    },
  },
  methods: {
    onWheel(e) {
      e.preventDefault()
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
        this.panelOps.x += e.deltaX * moveSpeed / this.panelOps.zoom
        this.panelOps.y += e.deltaY * moveSpeed / this.panelOps.zoom
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
        if (this.cache[node.id]) throw `[moa-whiteboard] The node's id in a flow must be unique.`
        this.cache[node.id] = node
      }

      this.nodes = chartData

      for (let startNode of chartData) {
        if (startNode.lineTo) {
          for (let endNodeId of startNode.lineTo) {
            this.lines.push({
              startNode,
              endNode: this.cache[endNodeId],
            })
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
