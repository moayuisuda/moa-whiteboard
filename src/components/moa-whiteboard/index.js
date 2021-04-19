import Vue from "vue";

const context = require.context("./", true, /.vue$/);

export default {
  install() {
    console.log("Flow components has been installed");
    Vue.$componentsConfig = {};
    context.keys().forEach((key) => {
      const component = context(key).default;
      Vue.component(component.name, component);
      if (component.isBoardCmp) {
        const config = (Vue.$componentsConfig[component.name] = {});
        config.defaultData = component.methods.getDefaultData();
        config.editable = component.data().editable;
      }
    });
  },
};
