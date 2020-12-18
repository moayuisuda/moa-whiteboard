<template>
  <g :transform="_transform">
    <moa-flow v-if="data.recursion" :data="node.data" />
    <g v-else>
      <rect :width="data.bounds.w" :height="data.bounds.h" />
      <text>{{ data.text }}</text>
    </g>
  </g>
</template>

<script>
export default {
  name: 'moa-flow',
  data() {
    return {
    }
  },
  computed: {
    _transform() {
      return `translate(${x}, ${y})`
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
  methods: {},
}
</script>

<style lang="scss" scoped></style>
