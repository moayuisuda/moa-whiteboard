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
    <moa-node @move="onNodeMove" v-for="node in nodes" :key="node.id" :nodeData="node"></moa-node>
    <moa-line v-for="line in lines" :key="line.id" :lineData="line"></moa-line>
  </svg>
</template>

<script>
import { hotKey } from './state'
const cache = {
  nodes: {},
  lines: {},
}

export default {
  name: 'moa-flow',
  data() {
    return {
      x: 0,
      y: 0,
      zoom: 1,
      nodes: [],
      lines: [],
      onCmd: false,
    }
  },
  mounted() {
    this.parseData()
    if (this.isRoot) this.initRoot()
  },
  computed: {
    _viewBox() {
      return `${this.x} ${this.y} ${this.width / this.zoom} ${this.height / this.zoom}`
    },
  },
  props: {
    isRoot: {
      type: Boolean,
      default: true,
    },
    flowData: {
      type: Array,
      default() {
        return []
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
        this.zoom += e.deltaY * 0.005
        if (this.zoom < 0.01) this.zoom = 0.1
        if (this.zoom > 100) this.zoom = 100
      }

      this.x += e.deltaX
      this.y += e.deltaY
    },
    initRoot() {
      this.$refs['container'].addEventListener('wheel', e => {
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
      for (let node of this.flowData) {
        cache[node.id] = node
      }
      const { nodes, lines } = cache

      this.nodes = this.flowData

      for (let item of this.flowData) {
        for (let direction in item.out) {
          for (let nodeId of item.out[direction]) {
            this.lines.push({
              start: {
                node: item,
                direction: direction,
              },
              end: {
                node: cache[nodeId],
                direction: this.getInDirection(item, cache[nodeId]),
              },
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
.moa-container {
  pointer-events: bounding-box;
}
</style>
