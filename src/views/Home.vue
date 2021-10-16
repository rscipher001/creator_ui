<template>
  <section>
    <div
      class="container is-max-desktop has-text-centered"
      style="margin-top: 72px"
    >
      <h1 class="is-size-4 has-text-weight-bold has-text-primary">
        Eliminate boring parts of software development
      </h1>
      <p class="mt-2">
        Tired of writing same auth, CRUD, over and over? Generate boring parts
        of your software and save time and money
      </p>
      <div class="mb-6 mt-3 buttons is-centered">
        <template v-if="!user">
          <b-button tag="router-link" to="/register" type="is-primary"
            >Try now</b-button
          >
          <b-button tag="router-link" to="/login" type="is-secondary"
            >Login</b-button
          >
        </template>
        <b-button v-else tag="router-link" to="/dashboard" type="is-primary"
          >Dashboard</b-button
        >
      </div>
      <div>
        <img
          style="max-width: 480px"
          src="@/assets/programming.svg"
          alt="Programmer with code illustration"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",

  computed: mapState("auth", {
    user: (state) => state.user,
    token: (state) => state.token,

    currentRouteName() {
      return this.$route.name;
    },
  }),
};
</script>
