<template>
  <rect
    rx="6"
    ry="6"
    :width="nodeData.bounds.w"
    :height="nodeData.bounds.h"
  />
</template>

<script>
export default {
  name: 'moa-rect',
  data() {
    return {}
  },
  computed: {
    _transform() {},
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
