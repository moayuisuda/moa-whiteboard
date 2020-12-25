<template>
  <svg class="moa-whiteboard" ref="svg" :width="width" :height="height" :viewBox="_viewBox">
    <filter id="dropshadow" height="130%" v-if="isRoot">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
      <!-- stdDeviation is how much to blur -->
      <feOffset dx="0" dy="0" result="offsetblur" />
      <!-- how much to offset -->
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.12" />
        <!-- slope is the opacity of the shadow -->
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <!-- this contains the offset blurred image -->
        <feMergeNode in="SourceGraphic" />
        <!-- this contains the element that the filter is applied to -->
      </feMerge>
    </filter>
    <moa-line v-for="lineData in lines" :key="lineData.id" :lineData="lineData"></moa-line>
    <moa-node @move="onNodeMove" v-for="nodeData in nodes" :key="nodeData.id" :nodeData="nodeData"></moa-node>
  </svg>
</template>

<script>
import { eventBus, hotKey } from './state'

export default {
  name: 'moa-whiteboard',
  provide: function() {
    return {
      container: this,
      [this.isRoot ? 'root' : 'container']: this
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
  created() {},
  mounted() {
    this.parseData()
    if (this.isRoot) this.initRoot()
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
        this.panelOps.zoom += e.deltaY * 0.005
        if (this.panelOps.zoom < 0.01) this.panelOps.zoom = 0.1
        if (this.panelOps.zoom > 100) this.panelOps.zoom = 100
      }

      this.panelOps.x += e.deltaX
      this.panelOps.y += e.deltaY
    },
    initChart() {
      this.svg = this.$refs['svg']
      this.pt = this.svg.createSVGPoint()
    },
    initRoot() {
      this.$refs['svg'].addEventListener('wheel', (e) => {
        this.onWheel(e)
      })
      window.addEventListener('mouseup', e => {
        eventBus.$emit('mouseup')
      })
      window.addEventListener('mousemove', (e) => {
        eventBus.$emit('mousemove', e)
      })
      window.addEventListener('keydown', (e) => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = true
        }
      })
      window.addEventListener('keyup', (e) => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = false
        }
      })
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
    onNodeMove(node) {},
    getInDirection(outNode, inNode) {
      for (let direction in inNode.in) {
        for (let nodeId of inNode.in[direction]) {
          if (nodeId === outNode.id) return direction
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-whiteboard {
  pointer-events: bounding-box;
}
</style>
