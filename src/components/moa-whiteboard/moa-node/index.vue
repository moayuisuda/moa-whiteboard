<template>
  <g
    @mousedown.stop="onMousedown"
    @dblclick.stop="onDblclick"
    @click.stop
    :transform="_transform"
    :class="`moa-node node-${nodeData.id}`"
  >
    <!-- focus样式 -->
    <rect
      v-if="_isFocus"
      class="moa-node__focus-border"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      fill="transparent"
      :stroke="$color['main']"
      :stroke-width="$style['stroke-width'] * 2"
      :rx="$style['radius']"
      :ry="$style['radius']"
    />
    <!-- 拉伸器 -->
    <moa-transformer :node-data="nodeData" :dots-show="_isEdit"/>

    <component :is="`moa-${nodeData.type}`" :nodeData="nodeData" :isEdit="_isEdit" :isFocus="_isFocus" />
  </g>
</template>

<script>
import { getCoords, getSVGScale } from '~/utils/coords'
import { eventBus, wbState } from '~/state'
const moveThreshold = 10

export default {
  name: 'moa-node',
  inject: ['container', 'root'],
  data() {
    return {}
  },
  computed: {
    _isFocus() {
      return wbState.focusNodes.includes(this)
    },
    _isEdit() {
      return wbState.editNode == this
    },
    _transform() {
      return `translate(${this.nodeData.bounds.x}, ${this.nodeData.bounds.y})`
    },
  },
  methods: {
    onMousedown(e) {
      if (!wbState.focusNodes.includes(this)) eventBus.$emit('focus', this)
      if (!wbState.dragNode !== this) eventBus.$emit('drag', this)
    },
    move(movement) {
      const scale = getSVGScale(this.container.svg)
      this.nodeData.bounds.x += movement.x * scale
      this.nodeData.bounds.y += movement.y * scale
    },
    // 聚焦节点跟随主拖拽节点移动，此时相当于这个拖拽节点是所有聚焦节点的controller，控制流：root-board -> dragNode -> focusNodes
    onDrag(movement) {
      wbState.focusNodes.forEach((node) => {
        node.move(movement)
      })
    },
    // 双击进入编辑状态
    onDblclick(e) {
      wbState.editNode = this
    },
  },
  props: {
    nodeData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-node {
  &__focus-border {
    pointer-events: none;
  }
}
</style>
