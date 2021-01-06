<template>
  <ul class="moa-controller--export center">
    <li @click="add(i)" v-for="i in nodes" :key="i" class="moa-controller--export__item">
      <img :src="require(`../assets/${i}.svg`)" />
    </li>
  </ul>
</template>

<script>
import { eventBus } from '@/state'

export default {
  name: 'moa-controller--export',
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
    add(nodeType) {
      eventBus.$emit('add', nodeType)
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-controller--export {
  background-color: white;
  border-radius: 4px;
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
