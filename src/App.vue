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
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    "nav-bar": NavBar,
    "app-footer": Footer,
  },
  created() {},
  methods: {},
};
</script>
