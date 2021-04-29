<template>
  <div
    ref="moa-node-bar"
    :style="{
    top: `${editBounds.top - 10}px`,
    left: `${left}px`,
  }"
    class="moa-node-bar center"
  >
    <component :is="`moa-${$wbState.editNode.nodeData.type}-bar`" />
    <!-- <img
      src="./assets/close.svg"
      alt=""
    /> -->
  </div>
</template>

<script>
export default {
  name: 'moa-node-bar',
  data() {
    return {
      left: 0
    }
  },
  props: {
    editBounds: {
      type: DOMRect
    },
  },
  computed: {},
  watch: {
    left: {
      handler() {
        this.$nextTick(() => {
          const barBounds = this.$refs['moa-node-bar'].getBoundingClientRect()
          this.left = this.editBounds.left + (this.editBounds.width - barBounds.width) / 2
          console.log(this.left)
        })
      },
      immediate: true
    }
  },
  methods: {
    close() {}
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.moa-node-bar {
  transform: translateY(-100%);
  background-color: white;
  border-radius: $radius;
  position: fixed;
}
</style>
