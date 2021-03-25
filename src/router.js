import Vue from "vue";
import VueRouter from "vue-router";
import whiteboard from "@/pages/layout/whiteboard/index.vue";

Vue.use(VueRouter);

// const contextRoutes = []
// const context = require.context('./pages', true, /index.vue$/)
// context.keys().forEach(key => {
//   const path = key.replace(/\/index.vue$/, '').replace(/\./, '')
//   const component = context(key).default

//   contextRoutes.push({
//     path,
//     component,
//     name: component.name
//   })
// })

const routes = [
  // ...contextRoutes,
  { path: "/", redirect: "/layout/whiteboard/INIT" },
  { path: "/layout/whiteboard/:id", component: whiteboard },
];

const router = new VueRouter({
  routes,
});

export default router;
