<template>
  <ul
    class="moa-right-page shadow"
    :style="{
    top: `${top}px`,
    left: `${left}px`,}"
  >
    <li
      class="
    moa-interct
    moa-right-page__item"
      @click="moveBack"
    >
      move back
    </li>
    <li
      class="moa-interct moa-right-page__item"
      @click="moveFront"
    >
      move front
    </li>
    <li
      class="moa-interct moa-right-page__item"
      @click="moveToTop"
    >
      move to top
    </li>
    <li
      class="moa-interct moa-right-page__item"
      @click="moveToBottom"
    >
      move to bottom
    </li>
  </ul>
</template>

<script>
export default {
  name: 'moa-right-page',
  data() {
    return {
      node: this.$wbState.focusNodes[this.$wbState.focusNodes.length - 1],
      nodes: this.$wbState.focusNodes[this.$wbState.focusNodes.length - 1]
        .container.nodes
    }
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
    moveBack() {
      const {
        nodes,
        node: { nodeData }
      } = this
      const index = nodes.indexOf(nodeData)
      if (index === 0) return
      nodes.splice(index - 1, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveFront() {
      const {
        nodes,
        node: { nodeData }
      } = this
      const index = nodes.indexOf(nodeData)
      if (index === nodes.length - 1) return
      nodes.splice(index + 1, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveToTop() {
      const {
        nodes,
        node: { nodeData }
      } = this
      nodes.splice(nodes.length, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    },
    moveToBottom() {
      const {
        nodes,
        node: { nodeData }
      } = this
      nodes.splice(0, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.moa-right-page {
  display: flex;
  background-color: white;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  border-radius: $radius;
  position: fixed;
  padding: 10px;

  &__item {
    padding: 10px;
  }
}
</style>
