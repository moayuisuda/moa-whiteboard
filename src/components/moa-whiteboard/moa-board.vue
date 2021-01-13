<template>
  <svg class="moa-whiteboard" ref="svg" :width="width" :height="height" :viewBox="_viewBox">
    <moa-line v-for="lineData in lines" :key="lineData.id" :lineData="lineData"></moa-line>
    <moa-node v-for="nodeData in nodes" :key="nodeData.id" :nodeData="nodeData"></moa-node>
  </svg>
</template>

<script>
import { eventBus, hotKey, wbState } from '@/state'
import { getCoords } from '@/utils/coords'

export default {
  name: 'moa-board',
  provide: function() {
    return this.isRoot
      ? {
          container: this,
          root: this,
          panelData: this.panelData,
        }
      : {
          container: this,
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
      if (hotKey.MetaLeft) {
        const oldCoords = getCoords(this.svg, this.pt, e)
        this.panelOps.zoom = this.panelOps.zoom + e.deltaY * 0.005

        if (this.panelOps.zoom < 0.1) this.panelOps.zoom = 0.1
        if (this.panelOps.zoom > 10) this.panelOps.zoom = 10

        this.svg.setAttribute('viewBox', this._viewBox)
        const newCoords = getCoords(this.svg, this.pt, e)

        this.panelOps.x -= newCoords.x - oldCoords.x
        this.panelOps.y -= newCoords.y - oldCoords.y
      } else {
        this.panelOps.x += e.deltaX / this.panelOps.zoom
        this.panelOps.y += e.deltaY / this.panelOps.zoom
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
