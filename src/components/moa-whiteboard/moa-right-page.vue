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
    <li
      class="moa-interct moa-right-page__item"
      @click="dele"
    >
      delete
    </li>
  </ul>
</template>

<script>
import { wbState } from '~/state'
export default {
  name: 'moa-right-page',
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
    dele() {
      wbState.focusNodes.forEach(node => node.dele())
      wbState.showRightPage = false
    },
    moveBack() {
      wbState.focusNodes.forEach(node => node.moveBack())
    },
    moveFront() {
      wbState.focusNodes.reverse().forEach(node => node.moveFront())
      wbState.focusNodes.reverse()
    },
    moveToTop() {
      wbState.focusNodes.reverse().forEach(node => node.moveToTop())
      wbState.focusNodes.reverse()
    },
    moveToBottom() {
      wbState.focusNodes.forEach(node => node.moveToBottom())
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
