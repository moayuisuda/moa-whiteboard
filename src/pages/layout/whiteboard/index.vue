<template>
  <div class="whiteboard">
    <moa-whiteboard :panelData="panelData" :editable="editable" :width="stageBounds.w" :height="stageBounds.h">
    </moa-whiteboard>
  </div>
</template>

<script>
import panelData from './data.json'

export default {
  name: 'whiteboard',
  data() {
    return {
      panelData,
      editable: true,
      stageBounds: {
        w: 1080,
        h: 720,
      },
    }
  },
  methods: {
    onResize() {
      this.stageBounds.w = document.documentElement.clientWidth
      this.stageBounds.h = document.documentElement.clientHeight
    },
  },
  created() {
    this.stageBounds.w = document.documentElement.clientWidth
    this.stageBounds.h = document.documentElement.clientHeight

    window.addEventListener('resize', this.onResize)
  },
}
</script>

<style lang="scss" scoped></style>
