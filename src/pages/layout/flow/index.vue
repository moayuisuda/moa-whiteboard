<template>
  <div>
    <moa-flow :flowData="flowData" :editable="editable">
    </moa-flow>
  </div>
</template>

<script>
import flowData from './data.json';
import nodes from './nodes.json'

export default {
  name: 'flow',
  data() {
    return {
      flowData,
      editable: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>