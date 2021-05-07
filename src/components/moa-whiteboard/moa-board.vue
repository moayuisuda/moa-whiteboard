<template>
  <g
    @wheel.stop="onWheel"
    @mouseover.stop="onMouseEnter"
    @mousemove="onMousemove"
    @mouseup="onMouseup"
  >
    <!-- 边框样式 -->
    <rect
      @click="onBackClick"
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
        >{{ project.id }}</option>
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
      <g v-show="nodeData.panelData.panelOps.zoom > 0.5">
        <circle
          v-for="dot in dots"
          :key="dot.x + '' + dot.y"
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
      <moa-node
        v-if="_isShowPreAddNode"
        :nodeData="$wbState.preAddNode"
      ></moa-node>
    </svg>
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
  inject: ['root'],
  data() {
    return {
      onCmd: false,
      startPoint: { x: undefined, y: undefined },
      dots: []
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    isEdit: {
      handler(v) {
        console.log('editBoard', v)
      }
    }
  },
  computed: {
    _projects() {
      return this.$wbState.projects.filter(p => p.id !== this.root.nodeData.id)
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
    isEdit: Boolean,
    isRoot: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  async created() {
    if (!this.isRoot && this.nodeData.model.project) {
      const data = await projectService.getProjectData(
        this.nodeData.model.project
      )
      data.panelData.panelOps.zoom = data.panelData.panelOps.zoom * 0.5
      Object.assign(this.nodeData, {
        panelData: data.panelData
      })
    }

    for (let i = 0; i <= this.nodeData.bounds.h; i += wbState.snap) {
      for (let j = 0; j <= this.nodeData.bounds.w; j += wbState.snap) {
        this.dots.push({
          x: j,
          y: i
        })
      }
    }
  },
  methods: {
    onMouseup(e) {
      const line = wbState.connectLine
      const start = wbState.connectNodes[0]
      if (start && line) {
        const coords = getCoords(this.svg, this.pt, e)
        if (line.type === 'group') {
          line.points.push(coords)
        } else {
        }

        wbState.connectLine = undefined
        wbState.connectNodes = []
      }
    },
    onClick() {
      const line = wbState.connectLine
      if (line) {
        const coords = getCoords(this.svg, this.pt, e)
        if (line.type === 'group') {
          line.points.push(coords)
        } else {
          if (line.start) line.end = coords
          else line.start = coords
        }
      }
    },
    async linkProject() {
      if (!this.nodeData.model.project) {
        const defaultData = this.getDefaultData()
        Object.assign(this.nodeData, {
          panelData: defaultData.panelData
        })
      } else {
        const data = await projectService.getProjectData(
          this.nodeData.model.project
        )
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
    onBackClick(e) {
      if (wbState.editBoard[wbState.editBoard.length - 1] === this) {
        wbState.focusNodes = []
        wbState.editNode = undefined
        wbState.focusLine = undefined
      }
    },
    onMouseEnter() {
      wbState.cursorBoard = this
    },
    onMousemove(e) {
      const coords = getCoords(this.svg, this.pt, e)
      const snapX =
          Math.round(coords.x / wbState.snap) * wbState.snap + wbState.snap,
        snapY =
          Math.round(coords.y / wbState.snap) * wbState.snap + wbState.snap

      if (wbState.preAddNode) {
        e.stopPropagation()
        wbState.preAddNode.bounds.x = snapX
        wbState.preAddNode.bounds.y = snapY
      }

      if (wbState.connectLine) {
        wbState.connectLine.end.x = snapX
        wbState.connectLine.end.y = snapY
      }

      if (hotKey.Space) {
        e.stopPropagation()
        this.onMove({ x: e.movementX, y: e.movementY })
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
