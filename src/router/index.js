import Vue from "vue";
import store from "@/store";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";

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
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "@/views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/request",
    name: "ForgotPasswordRequest",
    component: () =>
      import(
        /* webpackChunkName: "forgotPasswordRequest" */ "@/views/ForgotPasswordRequest.vue"
      ),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/verify",
    name: "ForgotPasswordVerify",
    component: () =>
      import(
        /* webpackChunkName: "forgotPasswordUpdate" */ "@/views/ForgotPasswordUpdate.vue"
      ),
    meta: {
      guest: true,
    },
  },
  {
    path: "/email/verify",
    name: "VerifyEmail",
    component: () =>
      import(/* webpackChunkName: "verifyEmail" */ "@/views/VerifyEmail.vue"),
  },
  {
    path: "/email/verificationPending",
    name: "EmailVerificationPending",
    component: () =>
      import(
        /* webpackChunkName: "verificationPending" */ "@/views/EmailVerificationPending.vue"
      ),
    meta: {
      auth: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "@/views/Dashboard.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project",
    name: "ProjectIndex",
    component: () =>
      import(/* webpackChunkName: "projectIndex" */ "@/views/ProjectIndex.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/project/create",
    name: "ProjectCreate",
    component: () =>
      import(
        /* webpackChunkName: "projectCreate" */ "@/views/ProjectCreate.vue"
      ),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
  },
  {
    path: "/setting",
    name: "Setting",
    component: () =>
      import(/* webpackChunkName: "setting" */ "@/views/Setting.vue"),
    meta: {
      auth: true,
      ensureEmailIsVerified: true,
    },
    children: [
      {
        path: "security",
        name: "SettingSecurity",
        component: () =>
          import(
            /* webpackChunkName: "settingSecurity" */ "@/views/setting/Security.vue"
          ),
        meta: {
          auth: true,
          ensureEmailIsVerified: true,
        },
      },
      {
        path: "account",
        name: "SettingAccount",
        component: () =>
          import(
            /* webpackChunkName: "settingAccount" */ "@/views/setting/Account.vue"
          ),
        meta: {
          auth: true,
          ensureEmailIsVerified: true,
        },
      },
      {
        path: "profile",
        name: "SettingProfile",
        component: () =>
          import(
            /* webpackChunkName: "settingProfile" */ "@/views/setting/Profile.vue"
          ),
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
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta) {
    return next();
  }

  const { meta } = to;
  if (meta.guest) {
    if (store.state.auth.token) {
      return next({
        name: "Dashboard",
      });
    }
  }

  if (meta.auth) {
    if (!store.state.auth.token) {
      return next({
        name: "Login",
      });
    }
  }

  if (meta.ensureEmailIsVerified) {
    if (!store.state.auth.user.emailVerifiedAt) {
      return next({
        name: "EmailVerificationPending",
      });
    }
    return next();
  }

  return next();
});

export default router;
