<template>
  <image
    :xlink:href="nodeData.model.url"
    x="0"
    y="0"
    :height="nodeData.bounds.h"
    :width="nodeData.bounds.w"
  />
</template>

<script>
export default {
  name: 'moa-image',
  isBoardCmp: true,
  data() {
    return {
      editable: false
    }
  },
  props: {
    isFocus: Boolean,
    isEdit: Boolean,
    nodeData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    getDefaultData() {
      return {
        model: {
          url: '',
        },
        type: 'image',
        bounds: {
          x: 0,
          y: 0,
          w: 150,
          h: 150
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-container {
  pointer-events: none;
  &--edit {
    pointer-events: auto;
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  input {
    width: 100%;
  }
}
.moa-input {
  position: relative;
  display: block;
  width: 100%;
  &__bar {
    position: absolute;
    background: #fff;
    padding: 4px 4px;
    top: -55px;
    left: 50%;
    transform: translateX(-50%);
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
}
.textarea-wrapper {
  font-weight: 500;
}
.content-editable {
  position: relative;
  z-index: -1;
  opacity: 0;
  display: block;
  width: 100%;
}
.field-textarea {
  border: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: $text-color;
  resize: none;
  overflow: hidden;
  background-color: transparent;
}
</style>
