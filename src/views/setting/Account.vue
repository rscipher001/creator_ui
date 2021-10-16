<template>
  <section>
    <h1 class="is-size-5">Account Setting</h1>
    <hr class="my-2" />
    <form method="POST" @submit.prevent="existingRequest">
      <div class="section" v-if="existingRequest">
        <p class="is-size-5 has-text-centered">
          Your request to change email to
          <span class="has-text-weight-bold">{{ existingRequest.email }}</span>
          is already pending,
          <a class="has-text-weight-bold" href="#">Click here</a> to cancel that
          request
        </p>
      </div>
      <b-field
        v-else
        label="Email *"
        :type="errors.email ? 'is-danger' : ''"
        :message="errors.email"
      >
        <b-input
          v-model="form.email"
          ref="accountSettingEmail"
          maxlength="127"
          minlength="2"
          required
        ></b-input>
      </b-field>
      <b-button
        :loading="loading.updateAccount"
        type="is-primary is-fullwidth"
        native-type="submit"
        >Update Account</b-button
      >
    </form>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "@/exceptions/ValidationException";

export default {
  name: "AccountSettingPage",

  mounted() {
    if (this.$refs.accountSettingEmail) this.$refs.accountSettingEmail.focus();
    this.form.email = this.user.email;
    this.getAccount();
  },

  data() {
    return {
      errors: {},
      existingRequest: null,
      form: {
        email: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      updateAccountAction: "updateAccount",
      getAccountAction: "getAccount",
    }),

    async getAccount() {
      try {
        const existingEmailUpdateRequest = await this.getAccountAction();
        this.existingRequest = existingEmailUpdateRequest;
      } catch (_) {
        /**
         * Ignore if this request fails, it is intentional
         */
      }
    },

    async updateAccount() {
      try {
        await this.updateAccountAction({
          email: this.form.email,
        });
        this.$buefy.toast.open({
          message: "Account settings updated successfully!",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        let message = "Unable to update account settings";
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
