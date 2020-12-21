<template>
  <div>
    <moa-flow :flowData="flowData" :editable="editable">
    </moa-flow>
  </div>
</template>

<script>
import flowData from './data.json';

export default {
  name: 'flow',
  data() {
    return {
      flowData,
      editable: false
    }
  },
  methods: {
    
  },
  mounted() {
    console.log(flowData)
  }
}
</script>

<style lang="scss" scoped>
</style>