<template>
  <ul class="moa-basic-bar shadow--inner">
    <li
      @mousedown.prevent="onSizeChange(i)"
      :class="{
              'moa-basic-bar-item': true,
              'moa-basic-bar-item--selected': model.size === i,
              'moa-basic-bar-item--size': true,
            }"
      v-for="i in ['S', 'M', 'L', 'XL']"
      :key="i"
    >
      {{ i }}
    </li>
    <span class="separator">|</span>
    <li
      @mousedown.prevent="onAlignChange(i)"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': model.align === i }"
      v-for="i in ['left', 'center', 'right']"
      :key="i"
    >
      <img
        :src="require(`../../assets/align-${i}.svg`)"
        alt=""
      />
    </li>
  </ul>
</template>

<script>
const padding = 20

export default {
  name: 'moa-basic-bar',
  data() {
    return {
      model: this.$wbState.editNode.nodeData.model
    }
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.$refs['textarea'].focus()
        } else {
          this.$refs['textarea'].blur()
        }
      }
    }
  },
  methods: {
    onAlignChange(align) {
      this.model.align = align
    },
    onSizeChange(size) {
      this.model.size = size
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-basic-bar {
  margin: 0;
  display: block;
  width: 100%;
  background: #fff;
  padding: 4px 4px;
  display: flex;
  justify-content: center;
  border-radius: 2px;
  &-item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    list-style: none;
    margin: 0 1px;
    padding: 0 4px;
    img {
      width: 12px;
    }
    &--size {
      font-size: 5px;
      font-weight: 500;
    }
    &:hover {
      background: $background-color;
    }
    &--selected {
      background-color: $background-color;
    }
  }
}
</style>
