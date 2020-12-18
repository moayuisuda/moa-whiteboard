<template>
  <div>
    <moa-flow :data="data" :editable="editable">
    </moa-flow>
  </div>
</template>

<script>
import data from './data.json';

export default {
  name: 'flow',
  data() {
    return {
      data,
      editable: false
    }
  },
  methods() {
    
  }
}
</script>

<style lang="scss" scoped>
</style>