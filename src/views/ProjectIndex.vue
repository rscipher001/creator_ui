<template>
  <section class="container">
    <b-loading is-full-page v-model="isLoading"></b-loading>
    <div class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <div class="level">
            <div class="level-left is-size-3">{{ meta.total }} Projects</div>
            <div class="level-right">
              <b-button tag="router-link" to="/project/create" type="is-white"
                >New</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns box">
        <div class="column">
          <b-table v-if="items.length" :data="items" bordered>
            <b-table-column field="name" label="Name" v-slot="props">
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="email" label="Status" v-slot="props">
              {{ props.row.status }}
            </b-table-column>
            <b-table-column label="Action" v-slot="props">
              <b-dropdown aria-role="list">
                <template #trigger="{ active }">
                  <b-button
                    label="More"
                    type="is-primary"
                    outlined
                    :icon-right="active ? 'menu-up' : 'menu-down'"
                  />
                </template>
                <b-dropdown-item
                  v-if="
                    props.row.input && props.row.input.generate.api.generate
                  "
                  @click="download(props.row.id, 'api')"
                  aria-role="listitem"
                  >Download API Code</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="
                    props.row.input && props.row.input.generate.spa.generate
                  "
                  @click="download(props.row.id, 'spa')"
                  aria-role="listitem"
                  >Download SPA Code</b-dropdown-item
                >
                <b-dropdown-item
                  @click="edit(props.row.id)"
                  aria-role="edititem"
                  >Edit</b-dropdown-item
                >
                <b-dropdown-item
                  @click="destroy(props.row.id)"
                  aria-role="listitem"
                  >Delete</b-dropdown-item
                >
              </b-dropdown>
            </b-table-column>
          </b-table>
          <div class="hero is-medium" v-else>
            <div class="hero-body container is-flex has-text-centered">
              <div class="is-flex-direction-colomn">
                <h1 class="is-size-2">Create a Project</h1>
                <p class="is-size-4">Click new to create your first project</p>
                <b-button
                  type="is-primary block mt-5"
                  tag="router-link"
                  to="/project/create"
                >
                  New
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <b-pagination
            class="mt-5"
            v-model="current"
            :total="meta.total"
            :per-page="meta.perPage"
            order="is-centered"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
          >
          </b-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ProjectList",

  data() {
    return {
      current: 1,
      editMode: {
        projectId: null,
      },
    };
  },

  created() {
    this.index();
  },

  methods: {
    ...mapActions("project", {
      indexAction: "index",
      storeAction: "store",
      destroyAction: "destroy",
      generateSignedUrl: "generateSignedUrl",
    }),

    index() {
      this.indexAction({
        pageSize: 10,
        pageNo: this.current,
      });
    },

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

  watch: {
    async current() {
      return this.index();
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
