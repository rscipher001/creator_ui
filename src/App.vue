<template>
  <div id="app" class="has-background-light">
    <div class="block">
      <nav-bar></nav-bar>
    </div>
    <div class="block">
      <router-view />
    </div>
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
