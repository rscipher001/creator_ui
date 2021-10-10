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
import { mapActions } from "vuex";
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
  methods: {
    ...mapActions("auth", {
      refreshUser: "refreshUser",
    }),
  },
};
</script>
