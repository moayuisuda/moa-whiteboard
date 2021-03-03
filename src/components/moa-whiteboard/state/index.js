

import Vue from "vue";

const user = {
  authorization: ''
}

const hotKey = {
  MetaLeft: false, // cmd
}

const eventBus = new Vue()

const wbState = {
  focusNodes: [],
  focusLine: undefined,
  dragNode: undefined,
  editNode: undefined,
  preAddNode: undefined, // 预添加的节点
  cursorBoard: undefined, // 当前鼠标所在的画板
  connectNodes: [] // 待链接的节点
}
Vue.observable(wbState)
Vue.prototype.$wbState = wbState

export {
  user,
  eventBus,
  hotKey,
  wbState,
}