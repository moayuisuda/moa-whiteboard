<template>
  <g v-if="dotsShow">
    <rect :width="nodeData.bounds.w" :height="nodeData.bounds.h" fill="transparent" stroke="#808080" stroke-width="1" />

    <rect
      v-for="(item, index) in dotsPosition"
      :key="index"
      @mousedown.stop="onMousedown(index, $event)"
      width="8"
      height="8"
      :x="item.x - 4"
      :y="item.y - 4"
      fill="#fff"
      stroke="#808080"
      stroke-width="1"
      :class="`moa-node-dots-${index}`"
    />
  </g>
</template>

<script>
import { getCoords } from '@/utils/coords'
const wMin = 20
const hMin = 20

export default {
  name: 'moa-transformer',
  inject: ['container'],
  props: {
    nodeData: {
      type: Object,
    },
    dotsShow: {
      type: Boolean,
    },
  },
  data() {
    return {
      oldNodeData: {},
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
        { x: 0, y: 0 },
        { x: w / 2, y: 0 },
        { x: w, y: 0 },
        { x: 0, y: h / 2 },
        { x: w, y: h / 2 },
        { x: 0, y: h },
        { x: w / 2, y: h },
        { x: w, y: h },
      ]
    },
  },
  methods: {
    onMousedown(index, event) {
      const coords = getCoords(this.container.svg, this.container.pt, event)
      this.oldNodeData = {
        index,
        x: coords.x,
        y: coords.y,
        w: this.nodeData.bounds.w,
        h: this.nodeData.bounds.h,
        ox: this.nodeData.bounds.x,
        oy: this.nodeData.bounds.y,
      }
      window.addEventListener('mousemove', this.onMousemove)
      window.addEventListener('mouseup', this.onMouseup)
    },
    onMousemove(event) {
      let width, height
      const coords = getCoords(this.container.svg, this.container.pt, event)

      if (this.oldNodeData.index < 2 || this.oldNodeData.index === 3) {
        width = this.oldNodeData.x - coords.x
        height = this.oldNodeData.y - coords.y
        this.nodeData.bounds.x = this.oldNodeData.ox - width
        this.nodeData.bounds.y = this.oldNodeData.oy - height
      } else if (this.oldNodeData.index === 2) {
        width = coords.x - this.oldNodeData.x
        height = this.oldNodeData.y - coords.y
        this.nodeData.bounds.y = this.oldNodeData.oy - height
      } else if (this.oldNodeData.index === 5) {
        width = this.oldNodeData.x - coords.x
        height = coords.y - this.oldNodeData.y
        this.nodeData.bounds.x = this.oldNodeData.ox - width
      } else {
        width = coords.x - this.oldNodeData.x
        height = coords.y - this.oldNodeData.y
      }

      this.nodeData.bounds.w = this.oldNodeData.w + width
      this.nodeData.bounds.h = this.oldNodeData.h + height
    },
    onMouseup(event) {
      window.removeEventListener('mousemove', this.onMousemove)
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-node-dots {
  &-0:hover,
  &-7:hover {
    cursor: nwse-resize;
  }

  &-1:hover,
  &-6:hover {
    cursor: ns-resize;
  }

  &-2:hover,
  &-5:hover {
    cursor: nesw-resize;
  }

  &-3:hover,
  &-4:hover {
    cursor: ew-resize;
  }
}
</style>
