<template>
  <section>
    <h1 class="is-size-5">Profile Setting</h1>
    <hr class="my-2" />
    <form method="POST" @submit.prevent="updateProfile">
      <b-field
        label="Name *"
        :type="errors.name ? 'is-danger' : ''"
        :message="errors.name"
      >
        <b-input
          v-model="form.name"
          ref="profileSettingName"
          maxlength="127"
          minlength="2"
          required
        ></b-input>
      </b-field>
      <b-button
        :loading="loading.updateProfile"
        type="is-primary is-fullwidth"
        native-type="submit"
        >Update Profile</b-button
      >
    </form>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "@/exceptions/ValidationException";

export default {
  name: "ProfileSettingPage",

  mounted() {
    if (this.$refs.profileSettingName) this.$refs.profileSettingName.focus();
    this.form.name = this.user.name;
  },

  data() {
    return {
      errors: {},
      form: {
        name: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      updateProfileAction: "updateProfile",
    }),
    async updateProfile() {
      try {
        await this.updateProfileAction({
          name: this.form.name,
        });
        this.$buefy.toast.open({
          message: "Profile updated successfully!",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        let message = "Unable to update profile";
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

  computed: {
    ...mapState("auth", {
      loading: (state) => state.loading,
      user: (state) => state.user,
    }),
  },
};
</script>
