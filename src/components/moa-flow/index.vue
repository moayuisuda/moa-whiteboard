<template>
  <svg class="moa-container" ref="container" :width="width" :height="height" :viewBox="_viewBox">
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
import { hotKey } from './state'

export default {
  name: 'moa-flow',
  data() {
    return {
      panelOps: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      nodes: [],
      lines: [],
      onCmd: false,
      cache: {
        nodes: [],
        lines: [],
      },
    }
  },
  created() {
    this.panelOps = this.panelData.panelOps
  },
  mounted() {
    this.parseData()
    if (this.isRoot) this.initRoot()
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
    initRoot() {
      this.$refs['container'].addEventListener('wheel', (e) => {
        this.onWheel(e)
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
      const { flowData } = this.panelData

      for (let node of flowData) {
        if (this.cache[node.id]) throw `[moa-flow] The node's id in a flow must be unique.`
        this.cache[node.id] = node
      }

      this.nodes = flowData

      for (let startNode of flowData) {
        for (let endNodeId in startNode.lineTo) {
          this.lines.push({
            startNode,
            endNode: this.cache[endNodeId],
          })
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
.moa-container {
  pointer-events: bounding-box;
}
</style>
