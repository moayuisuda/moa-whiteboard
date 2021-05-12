<template>
  <ul class="moa-basic-bar shadow">
    <li
      @mousedown.prevent="onStyleChange(i)"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': $wbState.focusNode.nodeData.model.style === i }"
      v-for="i in ['stroke', 'dash']"
      :key="i"
    >
      <img
        :src="require(`../../assets/line-${i}.svg`)"
        alt=""
      />
    </li>

    <span class="separator">|</span>
    <li
      @mousedown.prevent="onTypeChange(i)"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': $wbState.focusNode.nodeData.model.type === i }"
      v-for="i in _types"
      :key="i"
    >
      <img
        :src="require(`../../assets/line-${i}.svg`)"
        alt=""
      />
    </li>

    <span class="separator">|</span>
    <li
      @mousedown.prevent="onArrowChange"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': $wbState.focusNode.nodeData.model.arrow === 'true' }"
    >
      <img
        :src="require(`../../assets/arrow.svg`)"
        alt=""
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'moa-line-bar',
  data() {
    return {}
  },
  computed: {
    _types() {
      return this.$wbState.focusNode._isLink ? ['group', 'bezier'] : ['group']
    }
  },
  methods: {
    onStyleChange(style) {
      this.$wbState.focusNode.nodeData.model.style = style
    },
    onTypeChange(type) {
      this.$wbState.focusNode.nodeData.model.type = type
    },
    onArrowChange() {
      if (this.$wbState.focusNode.nodeData.model.arrow === 'true')
        this.$wbState.focusNode.nodeData.model.arrow = 'false'
      else this.$wbState.focusNode.nodeData.model.arrow = 'true'
    }
  }
}
</script>

<style lang="scss" scoped>
.color-picker {
  position: absolute;
  left: 30px;
  z-index: 1;
  bottom: 0; // li的flex会导致absolute的子元素也居中但不占用面积，需要手动设置top
  cursor: auto;
}
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
    position: relative;
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
      font-size: 10px;
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
