<template>
  <g
    @wheel.stop="onWheel"
    @mouseover.stop="onMouseenter"
    @mousemove="onMousemove"
    @mouseup="onMouseup"
    @mousedown="onMousedown"
  >
    <!-- 边框样式 -->
    <rect
      @mousedown="onBackMousedown"
      :rx="$style['radius']"
      :ry="$style['radius']"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      :fill="$color['background']"
      :stroke="_stroke"
      :stroke-width="$style['stroke-width']"
    />
    <foreignObject
      :width="nodeData.bounds.w"
      y=-30
      v-if="!isRoot"
    >
      <input
        v-model="nodeData.model.title"
        type="text"
        class="moa-board__title"
      >
      <select
        class="moa-board__project"
        v-model="nodeData.model.project"
        @change="linkProject"
      >
        <option
          v-for="project in _projects"
          :key="project.id"
          :value="project.id"
        >{{ project.name }}</option>
        <option value="">NOT LINK</option>
      </select>
    </foreignObject>
    <svg
      class="moa-board"
      ref="svg"
      :width="nodeData.bounds.w"
      :height="nodeData.bounds.h"
      :viewBox="_viewBox"
    >
      <g
        v-show="nodeData.panelData.panelOps.zoom >= 1"
        :transform="_gridTransform"
      >
        <circle
          v-for="(dot, index) in _dots"
          :key="index"
          :cx="dot.x"
          :cy="dot.y"
          r="1"
          :fill="$color['line']"
        />
      </g>
      <moa-node
        v-for="nodeData in nodeData.panelData.chartData"
        :key="nodeData.id"
        :nodeData="nodeData"
      ></moa-node>
      <moa-pre-add
        filter="url(#shadow)"
        @connect-start="onConnectStart"
        v-if="_isShowPreAdd"
      />
      <moa-node
        style="pointer-events: none"
        v-if="_isShowPreAddNode"
        :nodeData="$wbState.preAddNode"
      ></moa-node>
      <rect
        v-if="_ifShowSelectRect"
        fill="transparent"
        :stroke="$color['main']"
        :stroke-width="$style['stroke-width']"
        :x="selectBounds.x"
        :y="selectBounds.y"
        :width="selectBounds.w"
        :height="selectBounds.h"
      />
    </svg>

    <image
      v-if="_ifShowZoom"
      @mousedown="popEditBoard"
      width=20
      :x="nodeData.bounds.w / 2 - 10"
      y=10
      class="moa-board__zoom"
      :xlink:href="require('@/assets/zoom.svg')"
    />
  </g>
</template>

<script>
import { hotKey, wbState } from '~/state'
import { getCoords, getSVGScale } from '~/utils/coords'
import * as projectService from '@/services/project'
import { v4 } from 'uuid'

const zoomMin = 0.3
const zoomMax = 4
const moveSpeed = 1
const zoomSpeed = 0.002
const MARGIN = 40

export default {
  name: 'moa-board',
  isBoardCmp: true,
  editable: true,
  provide: function() {
    return this.isRoot
      ? {
          container: this,
          root: this
        }
      : {
          container: this
        }
  },
  inject: ['root', 'container'],
  data() {
    return {
      selecting: false,
      oldBounds: '',
      selectBounds: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      }
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    selecting(v) {
      if (v) {
        this.selectBounds.w = 0
        this.selectBounds.h = 0
      }
    }
  },
  computed: {
    _ifShowSelectRect() {
      let re = 0
      if (this.selecting) re++
      if (this.selectBounds.w > 10 || this.selectBounds.h > 10) re++
      if (re === 2) return true
      else return false
    },
    _ifShowZoom() {
      return wbState.editBoard.last() === this && !this.isRoot
    },
    _dots() {
      const re = []
      for (let i = 0; i <= this.nodeData.bounds.h; i += wbState.snap) {
        for (let j = 0; j <= this.nodeData.bounds.w; j += wbState.snap) {
          re.push({
            x: j,
            y: i
          })
        }
      }

      return re
    },
    _gridTransform() {
      const offsetX =
          Math.round(this.nodeData.panelData.panelOps.x / wbState.snap) *
          wbState.snap,
        offsetY =
          Math.round(this.nodeData.panelData.panelOps.y / wbState.snap) *
          wbState.snap
      return `translate(${offsetX}, ${offsetY})`
    },
    _projects() {
      return this.$wbState.projects.filter(p => p.id !== this.root.nodeData.id)
    },
    _isShowPreAdd() {
      return (
        wbState.onBoard === this &&
        wbState.focusNode &&
        wbState.focusNode.nodeData.bounds &&
        wbState.selectNodes.length < 2
      )
    },
    _isShowPreAddNode() {
      return wbState.preAddNode && wbState.cursorBoard === this
    },
    _stroke() {
      return this.isRoot ? 'none' : this.$color['line']
    },
    _viewBox() {
      return `${this.nodeData.panelData.panelOps.x} ${
        this.nodeData.panelData.panelOps.y
      } ${this.nodeData.bounds.w / this.nodeData.panelData.panelOps.zoom} ${this
        .nodeData.bounds.h / this.nodeData.panelData.panelOps.zoom}`
    },
    _nodeMap() {
      const { chartData } = this.nodeData.panelData
      const cache = {}

      for (let node of chartData) {
        if (cache[node.id]) {
          throw `[moa-whiteboard] The node's id in a flow must be unique.`
        }
        cache[node.id] = node
      }

      return cache
    }
  },
  props: {
    isEditBoard: {
      type: Boolean,
      default: false
    },
    isRoot: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object
    }
  },
  async created() {
    if (!this.isRoot && this.nodeData.model.project) {
      const data = (
        await projectService.getProjectData(this.nodeData.model.project)
      ).data

      data.panelData.panelOps.zoom = data.panelData.panelOps.zoom * 0.5
      Object.assign(this.nodeData, {
        panelData: data.panelData
      })
    }
  },
  methods: {
    saveBounds() {
      this.oldBounds = JSON.stringify(this.nodeData.bounds)
      const nodes = this.container.nodeData.panelData.chartData
      const offset = this.container.nodeData.panelData.panelOps
      const zoom = this.container.nodeData.panelData.panelOps.zoom

      const { nodeData } = this
      nodes.splice(nodes.length, 0, nodes.splice(nodes.indexOf(nodeData), 1)[0])

      this.nodeData.bounds.x = offset.x + MARGIN
      this.nodeData.bounds.y = offset.y + MARGIN
      this.nodeData.bounds.w =
        this.container.nodeData.bounds.w / zoom - MARGIN * 2
      this.nodeData.bounds.h =
        this.container.nodeData.bounds.h / zoom - MARGIN * 2
    },
    resetBounds() {
      this.nodeData.bounds = JSON.parse(this.oldBounds)
    },
    popEditBoard() {
      this.resetBounds()
      wbState.editBoard.pop()
    },
    onConnectStart(dir) {
      wbState.focusNode.onConnectStart(dir)
    },
    onMousedown() {},
    onMouseup(e) {},
    async linkProject() {
      if (!this.nodeData.model.project) {
        const defaultData = this.getDefaultData()
        Object.assign(this.nodeData, {
          panelData: defaultData.panelData
        })
      } else {
        const data = (
          await projectService.getProjectData(this.nodeData.model.project)
        ).data
        data.panelData.panelOps.zoom = data.panelData.panelOps.zoom * 0.5
        Object.assign(this.nodeData, {
          panelData: data.panelData
        })
      }
    },
    getDefaultData() {
      return {
        type: 'board',
        panelData: {
          panelOps: {
            zoom: 0.5,
            x: 0,
            y: 0
          },
          chartData: []
        },
        model: {
          title: 'child flow',
          project: ''
        },
        bounds: {
          x: 0,
          y: 0,
          w: 400,
          h: 400
        }
      }
    },
    onBackMousedown(e) {
      const coords = getCoords(
        wbState.cursorBoard.svg,
        wbState.cursorBoard.pt,
        e
      )

      if (wbState.editBoard.last() === this) {
        wbState.selectNodes = []
        wbState.editNode = undefined
        wbState.focusNode = undefined

        this.selecting = true
        this.selectStart = coords
      }
    },
    onMouseenter() {
      wbState.cursorBoard = this
    },
    onMousemove(e) {
      if (this.selecting) {
        if (e.x < this.selectStart.x) {
          this.selectBounds.x = e.x
        } else {
          this.selectBounds.x = this.selectStart.x
        }

        if (e.y < this.selectStart.y) {
          this.selectBounds.y = e.y
        } else {
          this.selectBounds.y = this.selectStart.y
        }

        this.selectBounds.w = Math.abs(e.x - this.selectStart.x)
        this.selectBounds.h = Math.abs(e.y - this.selectStart.y)
        console.log(this.selectBounds)
      }
    },
    onMove(movement) {
      const scale = getSVGScale(this.svg)
      this.nodeData.panelData.panelOps.x -= movement.x * scale
      this.nodeData.panelData.panelOps.y -= movement.y * scale
    },
    onWheel(e) {
      if (hotKey.MetaLeft || hotKey.AltLeft) {
        const oldCoords = getCoords(this.svg, this.pt, e)
        this.nodeData.panelData.panelOps.zoom =
          this.nodeData.panelData.panelOps.zoom + e.deltaY * zoomSpeed

        if (this.nodeData.panelData.panelOps.zoom <= zoomMin)
          this.nodeData.panelData.panelOps.zoom = zoomMin
        if (this.nodeData.panelData.panelOps.zoom >= zoomMax)
          this.nodeData.panelData.panelOps.zoom = zoomMax

        this.svg.setAttribute('viewBox', this._viewBox)
        const newCoords = getCoords(this.svg, this.pt, e)
        this.nodeData.panelData.panelOps.x -= newCoords.x - oldCoords.x
        this.nodeData.panelData.panelOps.y -= newCoords.y - oldCoords.y
      } else {
        this.nodeData.panelData.panelOps.x +=
          (e.deltaX * moveSpeed) / this.nodeData.panelData.panelOps.zoom
        this.nodeData.panelData.panelOps.y +=
          (e.deltaY * moveSpeed) / this.nodeData.panelData.panelOps.zoom
      }
    },
    initChart() {
      this.svg = this.$refs['svg']
      this.pt = this.svg.createSVGPoint()

      if (this.isRoot) {
        this.svg.addEventListener('wheel', this.onWheel)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.moa-board {
  &__zoom {
    cursor: pointer;
  }
  &__title {
    font-size: 20px;
    border: none;
    background-color: transparent;
    font-weight: bold;
    width: 60%;
  }
  &__project {
    width: 30%;
    text-align: center;
  }
}
</style>
