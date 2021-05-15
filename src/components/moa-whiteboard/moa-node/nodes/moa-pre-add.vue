<template>
  <g
    class="moa-pre-add"
    :transform="_transform"
  >
    <g
      class="moa-pre-add-dot"
      v-for="(item, index) in dotsPosition"
      :key="index"
      @click="onAdd(item.dir)"
      @mousedown.stop="onConnectPre"
      @mouseleave="onConnectStart(item.dir)"
      :transform="`translate(${item.x - dotSize / 2}, ${item.y - dotSize / 2})`"
    >
      <path
        stroke="none"
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path
        d="M24 16V32"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 24L32 24"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </g>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { hotKey, wbState } from '~/state'
const MARGIN = 40

export default {
  name: 'moa-pre-add',
  data() {
    return {
      oldNodeData: {},
      dotSize: 48
    }
  },
  computed: {
    dotsPosition() {
      const nodeData = wbState.focusNode.nodeData
      let w = nodeData.bounds.w
      let h = nodeData.bounds.h
      /*
      0   1   2
      |-------|
    3 |       | 4
      |-------|
      5   6   7
      */
      return [
        // { x: 0, y: 0 },
        { x: w / 2, y: 0 - MARGIN, dir: 'top' }, // top
        // { x: w, y: 0 },
        { x: 0 - MARGIN, y: h / 2, dir: 'left' }, // left
        { x: w + MARGIN, y: h / 2, dir: 'right' }, // right
        // { x: 0, y: h },
        { x: w / 2, y: h + MARGIN, dir: 'bottom' } // bottom
        // { x: w, y: h },
      ]
    },
    _transform() {
      return `translate(${wbState.focusNode.nodeData.bounds.x}, ${
        wbState.focusNode.nodeData.bounds.y
      })`
    }
  },
  methods: {
    onConnectPre() {
      this.connectPre = true
    },
    onConnectStart(dir) {
      if (this.connectPre) {
        this.connectPre = false
        this.$emit('connect-start', dir)
      }
    },
    getNodeFromId(id) {
      for (let node of wbState.focusNode.container.$children) {
        if (node.nodeData && node.nodeData.id === id) return node
      }
    },
    async onAdd(dir) {
      this.connectPre = false

      const MARGIN = 100
      const { bounds: origin, type } = wbState.focusNode.nodeData
      const newNodeData = await this.$componentsConfig[
        `moa-${type}`
      ].defaultData()
      const { bounds } = newNodeData
      const newLineData = this.$componentsConfig['moa-line'].defaultData()

      newNodeData.id = uuidv4()
      newLineData.id = uuidv4()
      newLineData.start = wbState.focusNode.nodeData.id
      newLineData.end = newNodeData.id
      newLineData.model.type = 'bezier'
      // newLineData.model.arrow = 'false'

      switch (dir) {
        case 'top':
          bounds.x = origin.x
          bounds.y = origin.y - origin.h - MARGIN
          newLineData.startP = 'top'
          newLineData.endP = 'bottom'
          break
        case 'bottom':
          bounds.x = origin.x
          bounds.y = origin.y + origin.h + MARGIN
          newLineData.startP = 'bottom'
          newLineData.endP = 'top'
          break
        case 'left':
          bounds.x = origin.x - origin.w - MARGIN
          bounds.y = origin.y
          newLineData.startP = 'left'
          newLineData.endP = 'right'
          break
        case 'right':
          bounds.x = origin.x + origin.w + MARGIN
          bounds.y = origin.y
          newLineData.startP = 'right'
          newLineData.endP = 'left'
      }

      const nodes = wbState.focusNode.container.nodeData.panelData
        .chartData

      nodes.push(newLineData)
      nodes.push(newNodeData)

      this.$nextTick(() => {
        const endNode = this.getNodeFromId(newNodeData.id)
        this.$wbState.selectNodes = [endNode]
        this.$wbState.focusNode = endNode
        this.$wbState.editNode = endNode
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-pre-add {
  &-dot {
    stroke: $background-color;
    fill: white;
    cursor: pointer;
    &:hover {
      fill: $main-color;
      stroke: white;
    }
  }
}
</style>
