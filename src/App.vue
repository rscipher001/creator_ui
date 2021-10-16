<template>
  <div id="app" class="has-background-white">
    <nav-bar></nav-bar>
    <router-view />
    <div class="block">
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    "nav-bar": NavBar,
    "app-footer": Footer,
  },

  mounted() {
    this.refreshUser();
  },

  computed: mapState("auth", {
    user: (state) => state.user,
    token: (state) => state.token,

    currentRouteName() {
      return this.$route.name;
    },
  }),

  methods: {
    ...mapActions("auth", {
      refreshUserAction: "refreshUser",
    }),

    refreshUser() {
      if (this.user) {
        this.refreshUserAction();
      }
    },
  },
};
</script>
