<template>
  <div id="app" class="has-background-light">
    <nav-bar></nav-bar>
    <router-view />
    <div class="block">
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    "nav-bar": NavBar,
    "app-footer": Footer,
  },

  mounted() {
    this.bootstrap();
  },

  computed: mapState("auth", {
    user: (state) => state.user,
    token: (state) => state.token,

    currentRouteName() {
      return this.$route.name;
    },
  }),

  methods: {
    bootstrap() {
      this.$store.dispatch("auth/bootstrap");
      this.$store.dispatch("project/bootstrap");
    },
  },
};
</script>
