<template>
  <g class="moa-line-anchor">
    <g
      class="moa-line-anchor-dot"
      v-for="(item, index) in dotsPosition"
      :key="index"
      @mouseup="onConnect(item.dir)"
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
const MARGIN = 0

export default {
  name: 'moa-line-anchor',
  inject: ['container'],
  props: {
    nodeData: {
      type: Object
    }
  },
  data() {
    return {
      oldNodeData: {},
      dotSize: 48
    }
  },
  computed: {
    dotsPosition() {
      let w = this.nodeData.bounds.w
      let h = this.nodeData.bounds.h
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
    }
  },
  methods: {
    async onConnect(dir) {
      const node = wbState.focusNode
      if (node.nodeData.type === 'line' && wbState.dragDot) {
        node.nodeData[`${wbState.dragDot.anchor}P`] = dir
        node.nodeData[wbState.dragDot.anchor] = this.nodeData.id
        node.$refs['line'].beautify()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-line-anchor {
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
