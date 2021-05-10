<template>
  <ul class="moa-basic-bar shadow">
    <li
      @click="togglePicker"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': ifShowPicker }"
    >
      <div :style="{
        width: '15px',
        height: '12px',
        border: `1px solid ${$color.line}`,
        backgroundColor: model.color,
        borderRadius: '2px'
      }" />
      <color-picker
        @input="updateValue"
        v-if="ifShowPicker"
        class="color-picker"
        :value="model.color"
      />
    </li>

    <span class="separator">|</span>
    <li
      @mousedown.prevent="onShapeChange(i)"
      :class="{ 'moa-basic-bar-item': true, 'moa-basic-bar-item--selected': model.shape === i }"
      v-for="i in ['rect', 'diamond', 'ellipse']"
      :key="i"
    >
      <img
        :src="require(`../../assets/shape-${i}.svg`)"
        alt=""
      />
    </li>

    <span class="separator">|</span>
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
import { Sketch } from 'vue-color'

export default {
  name: 'moa-basic-bar',
  components: {
    'color-picker': Sketch
  },
  data() {
    return {
      ifShowPicker: false,
      model: this.$wbState.focusNode.nodeData.model
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
    updateValue(v) {
      this.model.color = v.hex8
    },
    togglePicker() {
      if (this.ifShowPicker) this.ifShowPicker = false
      else this.ifShowPicker = true
    },
    onAlignChange(align) {
      this.model.align = align
    },
    onSizeChange(size) {
      this.model.size = size
    },
    onShapeChange(shape) {
      this.model.shape = shape
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
