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
      v-if="$wbState.editNode"
      :left="editBounds.left"
      :top="editBounds.top"
    ></moa-node-bar>
    <moa-right-page
      v-if="$wbState.showRightPage"
      :left="cursor.left"
      :top="cursor.top"
    ></moa-right-page>
  </div>
</template>

<script>
import { wbState, hotKey, reset } from '~/state'
import { getCoords } from '~/utils/coords'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'
import * as sourceService from '@/services/source'

export default {
  name: 'moa-whiteboard',
  data() {
    return {
      wbState,
      editBounds: {
        left: 0,
        top: 0
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
          console.log(node.$el, node.$el.getBoundingClientRect())
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
    uploadImage() {
      return new Promise(resolve => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.click()

        input.addEventListener('change', e => {
          sourceService.upload(e.target.files[0]).then(url => {
            resolve(url)
          })
        })
      })
    },
    async onPreAddNode(type) {
      const preAddNode = Vue.$componentsConfig[`moa-${type}`].defaultData()
      let url
      if (type === 'image') {
        url = await this.uploadImage()
        preAddNode.model.url = BASE_URL + url
      }
      preAddNode.id = uuidv4()
      wbState.preAddNode = preAddNode
    },
    onClick(e) {
      wbState.showRightPage = false
      if (wbState.preAddNode) {
        wbState.cursorBoard.nodes.push(wbState.preAddNode)
        wbState.preAddNode = undefined
        return
      }
      wbState.focusNodes = []
      wbState.editNode = undefined
      wbState.focusLine = undefined
    },
    onClickRight(e) {
      if (wbState.focusNodes[wbState.focusNodes.length - 1]) {
        wbState.showRightPage = true
        this.cursor.top = e.clientY
        this.cursor.left = e.clientX
      }
    },
    onMousedown() {},
    initEvents() {
      window.addEventListener('keydown', e => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = true
          case 'Space':
            hotKey.Space = true
        }
      })
      window.addEventListener('keyup', e => {
        switch (e.code) {
          case 'MetaLeft':
            hotKey.MetaLeft = false
          case 'Space':
            hotKey.Space = false
        }
      })
    },
    onMousemove(e) {
      if (wbState.preAddNode) {
        const coords = getCoords(
          wbState.cursorBoard.svg,
          wbState.cursorBoard.pt,
          e
        )
        wbState.preAddNode.bounds.x = coords.x + 10
        wbState.preAddNode.bounds.y = coords.y + 10
      }
      
      if (wbState.dragNode) {
        wbState.dragNode.onDrag({ x: e.movementX, y: e.movementY })
        wbState.editNode = undefined
      }
      if (hotKey.Space)
        wbState.cursorBoard.onMove({ x: e.movementX, y: e.movementY })
    },
    onMouseup() {
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

  .interct {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: $background-color;
  }
}
</style>
