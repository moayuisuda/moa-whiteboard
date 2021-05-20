<template>
  <div class="moa-whiteboard">
    <svg
      @click="onClick"
      @mousemove="onMousemove"
      @mouseup="onMouseup"
      @mousedown="onMousedown"
      @click.right.prevent
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
          markerWidth='10'
          markerHeight='10'
          refX='2'
          refY='2'
        >
          <path
            d='M0,0 L4,2 L0,4'
            :fill="$color['line']"
            stroke-linejoin="round"
            stroke-linecap="round"
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

    <moa-node-selector
      v-if="editable"
      @pre-add-node="onPreAddNode"
      class="moa-node-selector shadow"
    ></moa-node-selector>

    <moa-node-bar v-if="_ifShowNodeBar"></moa-node-bar>
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
import wrapperVue from '../../sdk/wrapper.vue'

export default {
  name: 'moa-whiteboard',
  data() {
    return {
      wbState,
      dragStart: {},
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
    '$wbState.focusNode': {
      handler(v, ov) {
        if (v) wbState.onBoard = wbState.focusNode.container
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
          wbState.editBoard.push(this.$refs['root-board']) // 防止第一次没有mounted拿不到
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
        wbState.focusNode &&
        !wbState.focusNode.onDragMove &&
        Vue.component(`moa-${wbState.focusNode.nodeData.type}-bar`)
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
        const id = wbState.preAddNode.id
        this.$nextTick(() => {
          const node = this.getNodeFromId(id)
          wbState.selectNodes = [node]
          wbState.focusNode = node
          wbState.editNode = node
          if (node.nodeData.type === 'line') {
            wbState.dragDot = node.nodeData.end
          }
        })

        wbState.preAddNode = undefined
        return
      }
    },
    getNodeFromId(id) {
      for (let node of wbState.cursorBoard.$children) {
        if (node.nodeData && node.nodeData.id === id) return node
      }
    },
    onDragStart(e) {
      this.dragStart = getCoords(wbState.onBoard.svg, wbState.onBoard.pt, e)
    },
    onMousedown(e) {
      wbState.choseFocus = false
      wbState.showRightPage = false

      if (wbState.focusNode && e.which === 3) {
        this.showRightPage(e)
      }
    },
    showRightPage(e) {
      wbState.showRightPage = true
      this.cursor.top = e.clientY
      this.cursor.left = e.clientX
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
      eventBus.$on('show-right-page', this.showRightPage)
    },
    nodeEventHandler(e) {
      console.log('on-event', e)
      const { type, name, data } = e
    },
    onMousemove(e) {
      if (!wbState.cursorBoard) return

      const coords = getCoords(
        wbState.cursorBoard.svg,
        wbState.cursorBoard.pt,
        e
      )

      if (wbState.dragNode) {
        const coords = getCoords(wbState.onBoard.svg, wbState.onBoard.pt, e)

        wbState.dragNode.onDragMove = true
        const { dragStart: start } = this
        const disX = coords.x - start.x
        const disY = coords.y - start.y
        // debugger
        if (Math.abs(disX) >= wbState.snap) {
          start.x = coords.x
          wbState.dragNode.onDrag({
            x: Math.round(disX / wbState.snap) * wbState.snap,
            y: 0
          })
        }
        if (Math.abs(disY) >= wbState.snap) {
          start.y = coords.y
          wbState.dragNode.onDrag({
            x: 0,
            y: Math.round(disY / wbState.snap) * wbState.snap
          })
        }

        wbState.editNode = undefined
      }

      const snapX = Math.round(coords.x / wbState.snap) * wbState.snap,
        snapY = Math.round(coords.y / wbState.snap) * wbState.snap

      wbState.editBoard.last().onMousemove(coords)
      if (wbState.dragDot) {
        const dot = wbState.dragDot
        dot.coords.x = snapX
        dot.coords.y = snapY
      }
      if (wbState.preAddNode) {
        if (wbState.preAddNode.type === 'line') {
          wbState.preAddNode.start.coords.x = snapX
          wbState.preAddNode.start.coords.y = snapY
          wbState.preAddNode.end.coords.x = snapX
          wbState.preAddNode.end.coords.y = snapY
        } else {
          wbState.preAddNode.bounds.x = snapX
          wbState.preAddNode.bounds.y = snapY
        }
      }
      if (hotKey.Space) {
        wbState.cursorBoard.onMove({ x: e.movementX, y: e.movementY })
      }
    },
    onMouseup(e) {
      wbState.editBoard.last().selecting = false
      wbState.focusNode && (wbState.focusNode.onDragMove = false)
      wbState.dragNode = undefined
      wbState.dragDot = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-whiteboard {
  position: relative;

  .moa-node-selector {
    position: absolute;
    left: 20px;
    top: 20px;
    list-style: none;
  }
}
</style>
