<template>
  <div
    ref="moa-node-bar"
    :style="{
    top: `${editBounds.top}px`,
    left: `${left}px`,
  }"
    class="moa-node-bar center"
  >
    <component :is="`moa-${$wbState.focusNode.nodeData.type}-bar`" />
  </div>
</template>

<script>
export default {
  name: 'moa-node-bar',
  data() {
    return {
      left: 0,
      editBounds: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }
  },
  props: {},
  computed: {},
  watch: {
    '$wbState.focusNode': {
      handler() {
        // 属性改变会先触发render watcher，先等待render watcher执行完
        this.$nextTick(() => {
          this.editBounds = this.$wbState.focusNode.$el.getBoundingClientRect()
          const barBounds = this.$refs['moa-node-bar'].getBoundingClientRect()
          this.left =
            this.editBounds.left + (this.editBounds.width - barBounds.width) / 2
        })
      },
      immediate: true
    }
  },
  methods: {
    close() {}
  }
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
