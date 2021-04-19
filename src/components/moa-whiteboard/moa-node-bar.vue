<template>
  <div
    :style="{
    top: `${top - 30}px`,
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
    return {}
  },
  props: {
    left: {
      type: Number
    },
    top: {
      type: Number
    }
  },
  computed: {},
  methods: {
    close() {}
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.moa-node-bar {
  background-color: white;
  border-radius: $radius;
  position: fixed;
}
</style>
