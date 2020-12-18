<template>
  <svg :width="data.width" :height="data.height" :viewBox="_viewBox">
    <moa-node @move="onNodeMove" v-for="node in nodes" :key="node.id" :data="node.data">
    </moa-node>

    <moa-line v-for="line in lines" :key="line.id" :data="line.data">
    </moa-line>
  </svg>
</template>

<script>
const cache = {
  nodes: {},
  lines: {},
}

export default {
  name: 'moa-flow',
  data() {
    return {
      zoom: 1,
      nodes: [],
      lines: []
    }
  },
  computed: {
    _viewBox() {
      return `${this.data.width * this.zoom} ${this.data.height * this.data.zoom} 0 0`
    },
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    parseData() {
      for(let node of this.data) {
        cache[node.id] = node
      }
      const { nodes, lines } = cache

      this.nodes = this.data
      for(let item of data) {
        for(let direction in item.out) {
          for(let nodeId of direction) {
            this.line.push({
              start: {
                node: item,
                direction: direction
              },
              out: {
                node: cache[nodeId],
                direction: getInDirection(item, cache[nodeId])
              },
            })
          }
        }
      }
    },
    onNodeMove(node) {

    },
    getInDirection(outNode, inNode) {
      for(let direction in inNode) {
        for(let nodeId of direction) {
          if(nodeId === outNode.id) return nodeId
        }
      }
    }
  },
  created() {
    this.parseData()
  }
}
</script>

<style lang="scss" scoped></style>
