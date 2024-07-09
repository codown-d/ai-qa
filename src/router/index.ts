// 导入相应的函数和你需要的组件
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Entry from "@/views/entry/index.vue";
import Home from "@/views/home/index.vue";
import Layout from "@/views/layout/index.vue";

// 定义路由
const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/", component: Home },
      {
        path: "/update-faq",
        component: () => import("@/views/update-faq/index.vue"),
      },
      {
        path: "/setting",
        component: () => import("@/views/setting/index.vue"),
      },
      {
        path: "/translate",
        component: () => import("@/views/translate/index.vue"),
      },
      {
        path: "/feedback",
        component: () => import("@/views/feedback/index.vue"),
      },
      {
        path: "/history",
        component: () => import("@/views/history/index.vue"),
      },
      {
        path: "/knowledge-base",
        component: () => import("@/views/knowledge-base/index.vue"),
      },
      {
        path: "/knowledge-add",
        component: () => import("@/views/knowledge-base/add-modal.vue"),
      },
      {
        path: "/knowledge-lib",
        component: () => import("@/views/knowledge-lib/index.vue"),
      },
    ],
  },
  { path: "/login", component: Entry },
];

// 创建 router 实例
const router = createRouter({
  // 使用 hash 模式
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

export default router;
