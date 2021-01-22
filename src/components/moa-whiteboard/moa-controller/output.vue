<template>
  <ul class="moa-controller--output center">
    <li @click="down()" class="moa-controller--output__item">
      <img src="../assets/output.svg" />
    </li>
    <li @click="share()" class="moa-controller--output__item">
      <img src="../assets/share.svg" />
    </li>
  </ul>
</template>

<script>
import { eventBus } from '~/state'

export default {
  name: 'moa-controller--output',
  data() {
    return {
      nodes: ['rect', 'pic', 'child'],
    }
  },
  computed: {},
  props: {
    lineData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    down() {},
    share() {},
    add(nodeType) {
      eventBus.$emit('add', nodeType)
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-controller--output {
  background-color: white;
  border-radius: $radius;
  &__item {
    img {
      display: block;
    }
    padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: $background-color;
    }
  }
}
</style>
