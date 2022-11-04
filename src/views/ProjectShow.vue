<template>
  <section class="container">
    <b-loading is-full-page v-model="isLoading"></b-loading>
    <div class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <div class="level">
            <div class="level-left is-size-3">Details</div>
            <div class="level-right">
              <b-button tag="router-link" to="/project" type="is-white">
                Back
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns box">
        <div class="column">
          <div class="hero is-medium">
            <div class="hero-body container is-flex has-text-centered">
              <div class="is-flex-direction-colomn">
                <h1 class="is-size-2">Review your input</h1>
                <p class="is-size-4">
                  Full project details will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ProjectShow",

  methods: {
    ...mapActions("project", {
      indexAction: "index",
      storeAction: "store",
      destroyAction: "destroy",
      generateSignedUrl: "generateSignedUrl",
    }),

    edit(projectId) {
      this.$router.push(`/project/${projectId}/edit`);
    },

    destroy(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting Project",
        message:
          "Are you sure you want to <b>delete</b> this project? Only unused project can be deleted",
        confirmText: "Delete Project",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          try {
            await this.destroyAction(id);
            this.$buefy.toast.open({
              message: "Deleted",
              type: "is-success",
              position: "is-bottom-right",
            });
          } catch (e) {
            console.error(e);
            this.$buefy.toast.open({
              message: "Unable to delete",
              type: "is-danger",
              position: "is-bottom-right",
            });
          }
        },
      });
    },

    async download(id, type) {
      try {
        const url = await this.generateSignedUrl({ id, type });
        return window.open(`${process.env.VUE_APP_API_URL}${url}`);
      } catch (e) {
        console.error(e);
        this.$buefy.toast.open({
          message: "Unable to start download",
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },

  computed: {
    ...mapState("auth", {
      user: (state) => state.user,
    }),
    ...mapState("project", {
      items: (state) => state.items,
      meta: (state) => state.meta,
      loading: (state) => state.loading,
    }),
    isLoading() {
      return this.loading.index || this.loading.store || this.loading.update;
    },
  },
};
</script>
