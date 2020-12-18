<template>
  <line :x1="_x1" :y1="_y1" :x2="_x2" :y2="_y2" style="stroke:rgb(255,0,0);stroke-width:2" />
</template>

<script>
export default {
  name: 'moa-line',
  data() {
    return {}
  },
  computed: {
    _x1() {
      const { start: { node, direction } } = this.data
      switch (direction) {
        case 'l':
          return 
      }
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
