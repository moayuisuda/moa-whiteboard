<template>
  <foreignObject>
    <div ref="container" :class="['text-container', { 'text-container--edit': isEdit }]">
      <div class="moa-input">
        <ul v-if="isEdit" class="moa-input__bar shadow--inner">
          <li
            @mousedown.prevent="onSizeChange(i)"
            :class="{
              'moa-input__bar-item': true,
              'moa-input__bar-item--selected': size === i,
              'moa-input__bar-item--size': true,
            }"
            v-for="i in ['S', 'M', 'L', 'XL']"
            :key="i"
          >
            {{ i }}
          </li>
          <span class="separator">|</span>
          <li
            @mousedown.prevent="onAlignChange(i)"
            :class="{ 'moa-input__bar-item': true, 'moa-input__bar-item--selected': align === i }"
            v-for="i in ['left', 'center', 'right']"
            :key="i"
          >
            <img :src="require(`../../assets/align-${i}.svg`)" alt="" />
          </li>

          <li @click="close" class="moa-input__bar-item moa-input__bar-close">
            <img src="../../assets/close.svg" alt="" />
          </li>
        </ul>
        <div
          ref="textarea-wrapper"
          class="textarea-wrapper"
          :style="{
            textAlign: _textAlign,
            fontSize: _fontSize + 'px',
          }"
        >
          <div class="content-editable" contenteditable="true" v-html="_contentValue"></div>
          <textarea
            :style="{
              textAlign: _textAlign,
            }"
            ref="textarea"
            @focus="onFocus"
            @blur="onBlur"
            class="field-textarea"
            :placeholder="placeholder"
            :value="value"
            @input="onInput"
            @compositionend="onCompositionend"
          >
          </textarea>
        </div>
      </div>
    </div>
  </foreignObject>
</template>

<script>
const padding = 20

export default {
  name: 'moa-input',
  data() {
    return {
      isFocus: false,
    }
  },
  props: {
    placeholder: String,
    value: String,
    fontSize: Number,
    align: String,
    size: String,
    isEdit: Boolean,
  },
  computed: {
    _fontSize() {
      switch (this.size) {
        case 'S':
          return 12
        case 'M':
          return 16
        case 'L':
          return 30
        case 'XL':
          return 40
      }
    },
    _contentValue() {
      return this.value.replace(/\n/g, '<br>') + '<br>'
    },
    _textAlign() {
      return this.align
    },
  },
  watch: {
    isEdit: {
      handler(val) {
        if (val) {
          this.$refs['textarea'].focus()
        } else {
          this.$refs['textarea'].blur()
        }
      },
    },
  },
  methods: {
    getNeedHeight() {
      return this.$refs['textarea-wrapper'].scrollHeight + padding * 2
    },
    onBlur() {
      this.isFocus = false
    },
    onFocus() {
      this.isFocus = true
    },
    close() {
      this.isFocus = false
    },
    onAlignChange(align) {
      this.$emit('align-change', align)
    },
    onSizeChange(size) {
      this.$emit('size-change', size)
    },
    onCompositionend(e) {
      this.$emit('compositionend', e.target.value, e)
    },
    onInput(e) {
      this.$emit('input', e.target.value, e)
    },
  },
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
