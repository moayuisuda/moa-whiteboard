<template>
  <foreignObject>
    <div
      ref="container"
      :class="['text-container', { 'text-container--edit': isEdit }]"
    >
      <div class="moa-input">
        <div
          ref="textarea-wrapper"
          class="textarea-wrapper"
          :style="{
            textAlign: _textAlign,
            fontSize: _fontSize + 'px',
          }"
        >
          <div
            class="content-editable"
            contenteditable="true"
            v-html="_contentValue"
          ></div>
          <textarea
            :style="{
              color: ifWhiteFont ? 'white' : '#333',
              textAlign: _textAlign,
            }"
            ref="textarea"
            @focus="onFocus"
            @blur="onBlur"
            class="field-textarea"
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
      isFocus: false
    }
  },
  props: {
    value: String,
    align: String,
    size: String,
    isEdit: Boolean,
    ifWhiteFont: Boolean
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
    }
  },
  watch: {
    isEdit: {
      handler(val) {
        console.log(val)
        if (val) {
          this.$refs['textarea'].focus()
        } else {
          this.$refs['textarea'].blur()
        }
      }
    }
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
  resize: none;
  overflow: hidden;
  background-color: transparent;
}
</style>
