import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Campaigns from "../views/Campaigns.vue";
import Leads from "../views/Leads.vue";
import Analytics from "../views/Analytics.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", component: Home, meta: { public: true } },
  { path: "/login", component: Login, meta: { public: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/campaigns", component: Campaigns, meta: { requiresAuth: true } },
  { path: "/leads", component: Leads, meta: { requiresAuth: true } },
  { path: "/analytics", component: Analytics, meta: { requiresAuth: true } },
  { path: "/users", component: Users, meta: { requiresAuth: true, adminOnly: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    return next("/login");
  }

  if (to.meta.adminOnly && auth.user?.role !== "admin") {
    return next("/dashboard");
  }

  if (to.path === "/login" && auth.token) {
    return next("/dashboard");
  }

  next();
});

export default router;