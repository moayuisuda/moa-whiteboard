<template>
  <div class="moa-whiteboard">
    <svg
      ref="stage"
      :width="width"
      :height="height"
    >
      <moa-board
        :isRoot="true"
        :nodeData="rootData"
        :editable="editable"
      ></moa-board>
    </svg>
    <moa-controller--node
      @pre-add-node="onPreAddNode"
      class="moa-controller shadow"
    ></moa-controller--node>
  </div>
</template>

<script>
import { eventBus, wbState, hotKey, reset } from '~/state'
import { getCoords } from '~/utils/coords'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

export default {
  name: 'moa-whiteboard',
  props: {
    rootData: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 1080
    },
    height: {
      type: Number,
      default: 720
    }
  },
  watch: {
    rootData: {
      handler() {
        this.rootData.bounds = {
          w: this.width,
          h: this.height
        }
        reset()
      },
      immediate: true
    },
    width: {
      handler(val) {
        this.rootData.bounds.w = val
      }
    },
    height: {
      handler(val) {
        this.rootData.bounds.h = val
      }
    }
  },
  mounted() {
    this.initEvents()
  },
  methods: {
    onPreAddNode(type) {
      const preAddNode = Vue.$defaultData[`moa-${type}`]()
      preAddNode.id = uuidv4()

      wbState.preAddNode = preAddNode
    },
    onAddNode(data) {
      rootData.push({
        value: '',
        type: type,
        style: {
          shape: 'rect',
          border: 'none',
          color: $color['line-color']
        },
        bounds: {
          x: 800,
          y: 400,
          w: 200,
          h: 200
        }
      })
    },
    initEvents() {
      const stage = this.$refs['stage']

      stage.addEventListener('click', e => {
        if (wbState.preAddNode) {
          wbState.cursorBoard.nodes.push(wbState.preAddNode)
          wbState.preAddNode = undefined
          return
        }
        wbState.focusNodes = []
        wbState.editNode = undefined
        wbState.focusLine = undefined
      })
      stage.addEventListener('mouseup', e => {
        this.onMouseUp(e)
      })
      stage.addEventListener('mousemove', e => {
        if (wbState.preAddNode) {
          const coords = getCoords(
            wbState.cursorBoard.svg,
            wbState.cursorBoard.pt,
            e
          )
          wbState.preAddNode.bounds.x = coords.x + 10
          wbState.preAddNode.bounds.y = coords.y + 10
        }
        this.onMousemove(e)
      })

      window.addEventListener('keydown', e => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = true
        }
      })
      window.addEventListener('keyup', e => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = false
        }
      })
    },
    onMousemove(e) {
      wbState.dragNode &&
        wbState.dragNode.onDrag({ x: e.movementX, y: e.movementY })
    },
    onMouseUp() {
      wbState.dragNode = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-whiteboard {
  position: relative;

  .moa-controller--node {
    position: absolute;
    left: 20px;
    top: 20px;
    list-style: none;
  }
}
</style>
