import Vue from "vue";
import moaWhiteboard from "@/components/moa-whiteboard";
import Wrapper from "./wrapper.vue";
import "@/theme/base.scss";
import color from "@/theme/variable";

Vue.use(moaWhiteboard);
Vue.use(color);

const whiteboard = ({ email, password, id, el, width, height }) => {
  new Vue({
    el,
    render: (h) =>
      h(Wrapper, {
        props: {
          email,
          password,
          id,
          width,
          height,
        },
      }),
  });
};

export { whiteboard };
