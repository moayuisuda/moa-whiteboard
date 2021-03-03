import Vue from "vue";

const context = require.context("./", true, /.vue$/);

export default {
  install() {
    console.log("Flow components has been installed:");
    Vue.$defaultData = {};
    context.keys().forEach((key) => {
      const component = context(key).default;
      Vue.component(component.name, component);
      if (component.methods && component.methods.getDefaultData) {
        Vue.$defaultData[component.name] = () => {
          return component.methods.getDefaultData();
        }
      }
    });
  },
};
