<template>
  <ul class="moa-node-selector">
    <li @click="add(i)" v-for="i in nodes" :key="i" class="moa-node-selector__item">
      <img :src="require(`./assets/${i}.svg`)" />
    </li>
  </ul>
</template>

<script>
import { eventBus } from '~/state'

export default {
  name: 'moa-node-selector',
  data() {
    return {
      nodes: ['basic', 'image', 'line', 'board'],
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
      this.$emit('pre-add-node', nodeType)
    },
  },
}
</script>

<style lang="scss" scoped>
.moa-node-selector {
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
