<template>
  <div>
    DATA:{{ flowData }}
  </div>
</template>

<script>
export default {
  name: 'moa-flow',
  props: {
    flowData: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>