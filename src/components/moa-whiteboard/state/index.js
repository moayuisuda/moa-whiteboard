import Vue from "vue";

const hotKey = {
  MetaLeft: false, // cmd
  Space: false,
  AltLeft: false,
};

const eventBus = new Vue();

const wbState = {
  selectNodes: [],
  dragNode: undefined,
  focusNode: undefined,
  editNode: undefined, // 双击
  preAddNode: undefined, // 预添加的节点
  cursorBoard: undefined, // 当前鼠标所在的画板
  editBoard: undefined, // 当前放大编辑的画板
  onBoard: undefined, // 当前有操作的画板
  dragDot: undefined,
  showRightPage: false,
  editBoard: [], // 当前编辑的流程，栈
  projects: [],
  snap: 20,
};
Vue.observable(wbState);
Vue.prototype.$wbState = wbState;

// 重新加载rootData后的清除状态函数
const reset = () => {
  Object.assign(wbState, {
    selectNodes: [],
    dragNode: undefined,
    focusNode: undefined,
    dragDot: undefined,
    editNode: undefined, // 双击
    preAddNode: undefined, // 预添加的节点
    cursorBoard: undefined, // 当前鼠标所在的画板
    showRightPage: false,
  });
};

export { eventBus, hotKey, wbState, reset };
