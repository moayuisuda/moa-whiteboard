<template>
  <div>
    <moa-flow :panelData="panelData" :editable="editable">
    </moa-flow>
  </div>
</template>

<script>
import panelData from './data.json';

export default {
  name: 'flow',
  data() {
    return {
      panelData,
      editable: false
    }
  },
  methods: {
    
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
</style>