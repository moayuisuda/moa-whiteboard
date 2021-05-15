<template>
  <div class="whiteboard">
    <moa-whiteboard
      :rootData="rootData"
      :editable="false"
      :width="width"
      :height="height"
    >
    </moa-whiteboard>
  </div>
</template>

<script>
import axios from 'axios'
import rootData from './data.json'
const host = 'http://localhost:3000'

export default {
  name: 'whiteboard',
  data() {
    return {
      rootData,
    }
  },
  props: {
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    el: {
      type: HTMLElement
    },
    width: {
      type: Number,
      default: 720
    },
    height: {
      type: Number,
      default: 480
    }
  },
  methods: {},
  // 首次进入
  async created() {
    const { email, password, id } = this
    const userInfo = (
      await axios.post(host + '/user/login', {
        email,
        password
      })
    ).data

    this.rootData = JSON.parse(
      (
        await axios({
          method: 'get',
          url: host + '/project/data/' + id,
          headers: {
            token: userInfo.token
          }
        })
      ).data.data
    )
    console.log(this.rootData)
  }
}
</script>

<style lang="scss" scoped>
</style>
