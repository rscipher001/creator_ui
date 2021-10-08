<template>
  <section class="hero is-fullheight-with-navbar is-light">
    <div class="hero-body container">
      <div class="card p-5">
        <form method="POST" @submit.prevent="register">
          <h1 class="is-size-3 has-text-centered pb-5">Register</h1>

          <b-field
            label="Name*"
            :type="errors.name ? 'is-danger' : ''"
            :message="errors.name"
          >
            <b-input
              v-model="form.name"
              ref="registerName"
              maxlength="127"
              minlength="2"
              required
            ></b-input>
          </b-field>

          <b-field
            label="Email *"
            :type="errors.email ? 'is-danger' : ''"
            :message="errors.email"
          >
            <b-input v-model="form.email" maxlength="127" required></b-input>
          </b-field>

          <b-field
            label="Password *"
            :type="errors.password ? 'is-danger' : ''"
            :message="errors.password"
          >
            <b-input
              v-model="form.password"
              type="password"
              maxlength="64"
              password-reveal
              required
            ></b-input>
          </b-field>

          <b-field
            label="Password Confirmation *"
            :type="errors.passwordConfirmation ? 'is-danger' : ''"
            :message="errors.passwordConfirmation"
          >
            <b-input
              v-model="form.passwordConfirmation"
              type="password"
              maxlength="72"
              password-reveal
              required
            ></b-input>
          </b-field>
          <b-button
            :loading="loading.register"
            type="is-primary is-fullwidth"
            native-type="submit"
            >Register</b-button
          >
        </form>
        <b-button
          class="is-fullwidth mt-2"
          tag="router-link"
          to="/login"
          type="is-light"
        >
          Login
        </b-button>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "../exceptions/ValidationException";

export default {
  name: "RegisterPage",

  mounted() {
    if (this.$refs.registerName) this.$refs.registerName.focus();
  },

  data() {
    return {
      errors: {},
      form: {
        email: "",
        password: "",
        passwordConfirmation: "",

        name: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      registerAction: "register",
    }),
    async register() {
      try {
        await this.registerAction({
          name: this.form.name,

          email: this.form.email,
          password: this.form.password,
          passwordConfirmation: this.form.passwordConfirmation,
        });
        this.$router.push("/dashboard");
      } catch (e) {
        let message = "Registration failed";
        if (e instanceof ValidationException) {
          this.errors = e.errors;
          message = "Validation Error";
        }
        this.$buefy.toast.open({
          message,
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },

  computed: mapState("auth", {
    loading: (state) => state.loading,
  }),
};
</script>
