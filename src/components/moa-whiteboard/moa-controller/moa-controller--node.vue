<template>
  <ul class="moa-controller--node">
    <li @click="add(i)" v-for="i in nodes" :key="i" class="moa-controller--node__item">
      <img :src="require(`../assets/${i}.svg`)" />
    </li>
  </ul>
</template>

<script>
import { eventBus } from '~/state'

export default {
  name: 'moa-controller--node',
  data() {
    return {
      nodes: ['basic', 'image', 'board'],
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
.moa-controller--node {
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
