<template>
  <section>
    <b-loading is-full-page v-model="isLoading"></b-loading>
    <h1 class="is-size-5">Profile Setting</h1>
    <hr class="my-2" />
    <div class="columns">
      <div class="column is-three-quarters">
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
      </div>
      <div class="column">
        <b-image
          :src="getAssetUrl(user.avatar.url) || 'https://picsum.photos/600/600'"
          alt="A random image"
          ratio="1by1"
          rounded
        ></b-image>
        <b-field class="file my-2">
          <b-upload @input="updateAvatar" v-model="file" expanded>
            <a class="button is-primary is-fullwidth">
              <b-icon icon="upload"></b-icon>
              <span>{{ file.name || "Select File" }}</span>
            </a>
          </b-upload>
        </b-field>
        <b-button @click="deleteAvatar" type="is-ghost is-fullwidth"
          >Delete Avatar</b-button
        >
      </div>
    </div>
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
      file: {},
      form: {
        name: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      updateProfileAction: "updateProfile",
      updateAvatarAction: "updateAvatar",
      deleteAvatarAction: "deleteAvatar",
    }),

    getAssetUrl(url) {
      return `${process.env.VUE_APP_API_URL}${url}`;
    },

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

    async updateAvatar(avatar) {
      try {
        const formData = new FormData();
        formData.append("avatar", avatar);
        await this.updateAvatarAction(formData);
        this.$buefy.toast.open({
          message: "Avatar updated successfully!",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        let message = "Unable to update Avatar";
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

    async deleteAvatar() {
      try {
        await this.deleteAvatarAction({ avatar: null });
        this.$buefy.toast.open({
          message: "Avatar delete successfully!",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        let message = "Unable to delete Avatar";
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

    isLoading: function () {
      return this.loading.deleteAvatar || this.loading.updateAvatar;
    },
  },
};
</script>
