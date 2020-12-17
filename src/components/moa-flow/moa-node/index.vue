<template>
  <g>
    <moa-flow v-if="data.childFlow" :data="node.data"/>
    <g v-else>
    <!-- <rect /> -->
    <text>{{ data.text }}</text>
    </g>
  </g>
</template>

<script>
export default {
  name: 'moa-flow',
  data() {
    return {
      zoom: 1
    }
  },
  computed: {
    _viewBox() {
      return `${this.data.width * this.zoom} ${this.data.height * this.zoom} 0 0`
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

  },
}
</script>

<style lang="scss" scoped></style>
