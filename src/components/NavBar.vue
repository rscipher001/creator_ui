<template>
  <b-navbar type="is-primary">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="@/assets/logo.webp" alt="Automation logo" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        Home
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        :active="currentRouteName === 'Dashboard'"
        :to="{ path: '/dashboard' }"
      >
        Dashboard
      </b-navbar-item>
      <b-navbar-item
        tag="router-link"
        :active="currentRouteName === 'ProjectCreate'"
        :to="{ path: '/project/create' }"
      >
        New Project
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons" v-if="!token">
          <b-button
            tag="router-link"
            to="/login"
            :active="currentRouteName === 'Login'"
            type="is-link"
          >
            Login
          </b-button>
          <b-button
            tag="router-link"
            to="/register"
            :active="currentRouteName === 'Register'"
            type="is-light"
          >
            Register
          </b-button>
        </div>
        <b-navbar-dropdown v-else :label="user.name || user.email">
          <b-navbar-item
            tag="router-link"
            to="/setting"
            :active="currentRouteName === 'Setting'"
            type="is-link"
          >
            Setting
          </b-navbar-item>
          <b-navbar-item @click.prevent="logout">Logout</b-navbar-item>
        </b-navbar-dropdown>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: mapState("auth", {
    user: (state) => state.user,
    token: (state) => state.token,

    currentRouteName() {
      return this.$route.name;
    },
  }),

  methods: {
    ...mapActions("auth", {
      logoutAction: "logout",
    }),

    async logout() {
      try {
        await this.logoutAction();
        window.location.reload();
      } catch (e) {
        this.$buefy.toast.open({
          message: "Logout failed",
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },
};
</script>
