<template>
  <ul
    :style="{
    top: `${top - 30}px`,
    left: `${left}px`,
  }"
    class="moa-node-bar center"
  >
    <li class="moa-node-bar__item">
      <h1>BAR ITEM</h1>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'moa-node-bar',
  data() {
    return {}
  },
  props: {
    left: {
      type: Number,
    },
    top: {
      type: Number
    },
  },
  computed: {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.moa-node-bar {
  background-color: white;
  border-radius: $radius;
  position: fixed;
  margin: 0;
  // z-index: 1;
  &__item {
    list-style: none;
    img {
      display: block;
      width: 36px;
    }
    // padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: $background-color;
    }
  }
}
</style>
