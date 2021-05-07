<template>
  <div class="moa-whiteboard">
    <svg
      @click="onClick"
      @mousemove="onMousemove"
      @mouseup="onMouseup"
      @click.right.prevent="onClickRight"
      @mousedown="onMousedown"
      ref="stage"
      :width="width"
      :height="height"
    >
      <defs>
        <filter
          id="shadow"
          filterUnits="objectBoundingBox"
        >
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="3"
            flood-color="#333"
            flood-opacity="0.1"
          />
        </filter>
        <marker
          id='arrow'
          orient="auto"
          markerWidth='4'
          markerHeight='4'
          refX='0'
          refY='2'
        >
          <!-- triangle pointing right (+x) -->
          <path
            d='M0,0 L4,2 L0,4'
            fill="transparent"
            :stroke="$color['line']"
          />
        </marker>
      </defs>

      <moa-board
        ref="root-board"
        :isRoot="true"
        :nodeData="rootData"
        :editable="editable"
      ></moa-board>
    </svg>

    <moa-controller--node
      v-if="editable"
      @pre-add-node="onPreAddNode"
      class="moa-controller shadow"
    ></moa-controller--node>

    <moa-node-bar
      v-if="_ifShowNodeBar"
      :editBounds="editBounds"
    ></moa-node-bar>
    <moa-right-page
      v-if="$wbState.showRightPage"
      :left="cursor.left"
      :top="cursor.top"
    ></moa-right-page>
  </div>
</template>

<script>
import { wbState, hotKey, reset, eventBus } from '~/state'
import { getCoords } from '~/utils/coords'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

export default {
  name: 'moa-whiteboard',
  data() {
    return {
      wbState,
      dragStart: {},
      editBounds: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      cursor: {
        left: 0,
        top: 0
      }
    }
  },
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
      default: 720
    },
    height: {
      type: Number,
      default: 480
    }
  },
  watch: {
    'wbState.editNode': {
      handler(node) {
        if (node) {
          this.editBounds = node.$el.getBoundingClientRect()
        }
      }
    },
    rootData: {
      handler() {
        this.rootData.bounds = {
          w: this.width,
          h: this.height
        }
        Vue.observable(this.rootData.bounds)
        reset()
        this.$nextTick(() => {
          wbState.editBoard = [this.$refs['root-board']] // 防止第一次没有mounted拿不到
        })
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
    this.init()
  },
  computed: {
    // _transform() {
    //   return `translate(${Math.round(
    //     this.nodeData.panelData.panelOps.x /
    //   ) * wbState.snap}, ${Math.round(this.nodeData.panelData.panelOps.y) / wbState.snap * })`
    // },
    _ifShowNodeBar() {
      return (
        wbState.editNode &&
        Vue.component(`moa-${this.$wbState.editNode.nodeData.type}-bar`)
      )
    }
  },
  methods: {
    async onPreAddNode(type) {
      const preAddNode = await this.$componentsConfig[
        `moa-${type}`
      ].defaultData()
      preAddNode.id = uuidv4()
      wbState.preAddNode = preAddNode
    },
    onClick() {
      if (wbState.preAddNode) {
        wbState.cursorBoard.nodeData.panelData.chartData.push(
          wbState.preAddNode
        )
        wbState.preAddNode = undefined
        return
      }
    },
    onClickRight(e) {
      if (wbState.focusNodes[wbState.focusNodes.length - 1]) {
        wbState.showRightPage = true
        this.cursor.top = e.clientY
        this.cursor.left = e.clientX
      }
    },
    onMousedown(e) {
      wbState.showRightPage = false
    },
    init() {
      window.addEventListener('keydown', e => {
        switch (e.code) {
          case 'MetaLeft':
            e.preventDefault()
            hotKey.MetaLeft = true
            break
          case 'AltLeft':
            e.preventDefault()
            hotKey.AltLeft = true
            break
          case 'Space': {
            // e.preventDefault()
            hotKey.Space = true
          }
        }
      })
      window.addEventListener('keyup', e => {
        switch (e.code) {
          case 'MetaLeft':
            e.preventDefault()
            hotKey.MetaLeft = false
            break
          case 'AltLeft':
            e.preventDefault()
            hotKey.AltLeft = false
            break
          case 'Space':
            // e.preventDefault()
            hotKey.Space = false
        }
      })

      eventBus.$on('node-event', this.nodeEventHandler)
      eventBus.$on('drag-start', this.onDragStart)
    },
    onDragStart(e) {
      console.log('start')
      this.dragStart = getCoords(wbState.onBoard.svg, wbState.onBoard.pt, e)
    },
    nodeEventHandler(e) {
      console.log('on-event', e)
      const { type, name, data } = e
    },
    onMousemove(e) {
      if (wbState.dragNode) {
        wbState.dragNode.onDragMove = true
        const coords = getCoords(wbState.onBoard.svg, wbState.onBoard.pt, e)
        const { dragStart: start } = this
        const disX = coords.x - start.x
        const disY = coords.y - start.y
        wbState.dragNode.onDrag({
          x: Math.round(disX / wbState.snap) * wbState.snap,
          y: Math.round(disY / wbState.snap) * wbState.snap
        })

        wbState.editNode = undefined
      }
    },
    onMouseup() {
      wbState.onDragMove = false
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
