/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import Login from "../components/Login.vue";
import Bookings from "../components/bookings/Bookings.vue";
import Employees from "../components/employees/Employees.vue";
import Users from "../components/users/Users.vue";
import WorkPoints from "../components/workpoints/WorkPoints.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true,
      },
    },
    {
      path: "/bookings",
      name: "bookings",
      component: Bookings,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/employees",
      name: "employees",
      component: Employees,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/accounts",
      name: "accounts",
      component: Users,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/workPoints",
      name: "workPoints",
      component: WorkPoints,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
