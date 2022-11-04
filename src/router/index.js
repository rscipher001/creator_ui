import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/request",
    name: "ForgotPasswordRequest",
    component: () => import("../views/ForgotPasswordRequest.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/verify",
    name: "ForgotPasswordVerify",
    component: () => import("../views/ForgotPasswordUpdate.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/email/verify",
    name: "VerifyEmail",
    component: () => import("../views/VerifyEmail.vue"),
  },
  {
    path: "/emailUpdate",
    name: "UpdateEmail",
    component: () => import("../views/UpdateEmail.vue"),
  },
  {
    path: "/email/verificationPending",
    name: "EmailVerificationPending",
    component: () => import("../views/EmailVerificationPending.vue"),
    meta: {
      auth: true,
      emailUnverified: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/ProjectIndex.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project",
    name: "ProjectIndex",
    component: () => import("../views/ProjectIndex.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project/create",
    name: "ProjectCreate",
    component: () => import("../views/ProjectCreate.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project/:id/edit",
    name: "ProjectEdit",
    component: () => import("../views/ProjectCreate.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project/:id",
    name: "ProjectShow",
    component: () => import("../views/ProjectShow.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project/:id/pay/stripe",
    name: "StripePay",
    component: () => import("../views/StripePay.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/setting",
    component: () => import("../views/Setting.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
    children: [
      {
        path: "security",
        name: "SettingSecurity",
        component: () => import("../views/setting/Security.vue"),
        meta: {
          auth: true,
          ensureEmailIsVerified: true,
        },
      },
      {
        path: "account",
        name: "SettingAccount",
        component: () => import("../views/setting/Account.vue"),
        meta: {
          auth: true,
          ensureEmailIsVerified: true,
        },
      },
      {
        path: "/",
        name: "SettingProfile",
        component: () => import("../views/setting/Profile.vue"),
        meta: {
          auth: true,
          ensureEmailIsVerified: true,
        },
      },
    ],
  },
];
// RoutesEnd

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta) {
    return next();
  }

  const { meta } = to;

  /**
   * Redirect users to dashboard when logged in and tries to access login page
   */
  if (meta.guest) {
    if (store.state.auth.token) {
      return next({
        name: "Dashboard",
      });
    }
  }

  /**
   * Redirect users to login page when not logged in
   */
  if (meta.auth) {
    if (!store.state.auth.token) {
      return next({
        name: "Login",
      });
    }
  }

  /**
   * Redirect users to dashboard when email verified but tries to access verification page
   */
  if (meta.emailUnverified) {
    if (store.state.auth.user && store.state.auth.user.emailVerifiedAt) {
      return next({
        name: "Dashboard",
      });
    }
  }

  /**
   * Redirect users to email verification page if not verified
   */
  if (meta.ensureEmailIsVerified) {
    if (!store.state.auth.user.emailVerifiedAt) {
      return next({
        name: "EmailVerificationPending",
      });
    }
  }

  return next();
});

export default router;
