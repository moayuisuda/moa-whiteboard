<template>
  <div>
    <moa-chart :panelData="panelData" :editable="editable">
    </moa-chart>
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