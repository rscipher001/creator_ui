<template>
  <div id="app" class="has-background-light">
    <nav-bar></nav-bar>
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    "nav-bar": NavBar,
  },
  created() {},
  methods: {},
};
</script>
