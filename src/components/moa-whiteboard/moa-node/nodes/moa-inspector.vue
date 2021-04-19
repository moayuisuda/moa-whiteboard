<template>
  <foreignObject
    :width="nodeData.bounds.w"
    :height="nodeData.bounds.h"
  >
    <div
      ref="container"
      class="moa-inspector-container"
    >
      <h2>Inspector</h2>
      <div
        ref="inner"
        class="moa-inspector-inner"
      >
        <pre :style="{
            transform: `translateY(${scroll}px)`,
          }">{{ _panelData }}</pre>
      </div>
    </div>
  </foreignObject>
</template>

<script>
export default {
  name: 'moa-inspector',
  isBoardCmp: true,
  inject: ['container'],
  data() {
    return {
      scroll: 0,
      editable: false
    }
  },
  methods: {
    getDefaultData() {
      return {}
    }
  },
  mounted() {
    const container = this.$refs['container']
    const inner = this.$refs['inner']

    container.addEventListener('wheel', e => {
      e.stopPropagation()
      // this.scroll -= e.deltaY
      // if(this.scroll >= 0 && e.deltaY < 0) this.scroll = 0
    })
  },
  computed: {
    _panelData() {
      return JSON.stringify(this.container.nodeData.panelData, null, 2)
    }
  },
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-inspector {
  &-inner {
    overflow: hidden;
  }
  &-container {
    overflow: scroll;
    padding: 10px;
    background: white;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    font-size: 10px;
    h2 {
      text-align: center;
      border-bottom: 1px solid $line-color;
    }
  }
}
</style>
