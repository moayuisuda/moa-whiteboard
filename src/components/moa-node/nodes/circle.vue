<template>
  <rect :width="nodeData.bounds.w" :height="nodeData.bounds.h" :style="{
    stroke: nodeData.style.color,
    'stroke-width': 2,
  }"/>
</template>

<script>
export default {
  name: 'moa-circle',
  data() {
    return {}
  },
  computed: {
    _transform() {
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

<style lang="scss" scoped></style>
