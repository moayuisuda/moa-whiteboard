import Vue from "vue";

const context = require.context("./", true, /.vue$/);

export default {
  install() {
    Vue.prototype.$componentsConfig = {};
    context.keys().forEach((key) => {
      const component = context(key).default;
      Vue.component(component.name, component);
      if (component.isBoardCmp) {
        const config = (Vue.prototype.$componentsConfig[component.name] = {});
        config.defaultData = () => {
          return component.methods.getDefaultData(); // 这里必须是函数，要不然加的节点都是同一个对象
        }
        config.editable = component.data().editable;
      }
    });
  },
};
