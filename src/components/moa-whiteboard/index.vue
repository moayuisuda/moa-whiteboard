<template>
  <div class="moa-whiteboard">
    <svg
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
    <moa-node-bar v-if="wbState.editNode" :left="editBounds.left" :top="editBounds.top"></moa-node-bar>
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
        x: 0,
        y: 0
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
        if(node) {
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
      const preAddNode = Vue.$defaultData[`moa-${type}`]()
      let url
      if (type === 'image') {
        url = await this.uploadImage()
      }
      if (url) preAddNode.value = BASE_URL + url
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
      wbState.dragNode &&
        wbState.dragNode.onDrag({ x: e.movementX, y: e.movementY })
      if (hotKey.Space)
        wbState.cursorBoard.onMove({ x: e.movementX, y: e.movementY })
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
