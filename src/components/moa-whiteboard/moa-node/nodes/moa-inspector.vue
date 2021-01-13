<template>
  <foreignObject :width="nodeData.bounds.w" :height="nodeData.bounds.h">
    <div ref="container" class="moa-inspector-container">
      <h2>Inspector</h2>
      <pre>{{ _panelData }}</pre>
    </div>
  </foreignObject>
</template>

<script>
import { hexToRgb } from '@/utils/style'
const alpha = 0.55

export default {
  name: 'moa-inspector',
  inject: ['panelData'],
  data() {
    return {}
  },
  mounted() {
    this.$refs['container'].addEventListener('wheel', e => {
      e.stopPropagation();
    })
  },
  computed: {
    _panelData() {
      return JSON.stringify(this.panelData, null, 2)
    },
  },
  props: {
    nodeData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-inspector {
  &-container {
    overflow: scroll;
    padding: 10px;
    background: white;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 2px solid $line-color;
    font-size: 10px;
    h2 {
      text-align: center;
      border-bottom: 1px solid $line-color;
      margin-bottom: 20px;
    }
  }
}
</style>
