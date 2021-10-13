import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";
import Login from "../views/Login";

import Dashboard from "../views/admin/Dashboard";
import Blacklist from "../views/admin/Blacklist";
import Whitelist from "../views/admin/Whitelist";
import Visit from "../views/admin/Visit";

Vue.use(VueRouter);

const routes = [
  {
    // Login Page
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: () => import("../views/admin/AdminHome.vue"),
    children: [
      { path: "", component: Dashboard },
      { path: "blacklist", component: Blacklist },
      { path: "whitelist", component: Whitelist },
      { path: "visit", component: Visit },
    ],
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else if (to.path == "/") {
    if (firebase.auth().currentUser) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
