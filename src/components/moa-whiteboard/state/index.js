

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
  dragNode: undefined,
  editNode: undefined,
  preAddNode: undefined,
  cursorBoard: undefined,
}
Vue.observable(wbState)
Vue.prototype.$wbState = wbState

export {
  user,
  eventBus,
  hotKey,
  wbState,
}