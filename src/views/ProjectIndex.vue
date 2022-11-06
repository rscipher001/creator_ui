<template>
  <section class="container">
    <b-loading is-full-page v-model="isLoading"></b-loading>
    <div class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <div class="level">
            <div class="level-left is-size-3">{{ meta.total }} Projects</div>
            <div class="level-right">
              <b-button
                tag="router-link"
                to="/project/create"
                type="is-primary"
              >
                New
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns box py-0">
        <div class="column">
          <b-field label="Page Size">
            <b-select
              v-model="currentPageSize"
              placeholder="Select page size"
              expanded
            >
              <option
                v-for="(option, index) in [10, 25, 50, 100, 200, 500]"
                :value="option"
                :key="index"
              >
                {{ option }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Name">
            <b-input v-model="filter.name" maxlength="127"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Status">
            <b-select v-model="filter.status" expanded>
              <option value="">All</option>
              <option
                v-for="(s, si) in ['draft', 'queued', 'done']"
                :value="s"
                :key="si"
              >
                {{ capitalize(s) }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns box">
        <div class="column">
          <b-table
            v-if="items.length"
            :data="items"
            :default-sort="['id', 'desc']"
            @sort="sort"
            backend-sorting
            hoverable
            bordered
          >
            <b-table-column field="id" label="ID" v-slot="props" sortable>
              {{ props.row.id }}
            </b-table-column>
            <b-table-column field="name" label="Name" v-slot="props">
              {{ props.row.name }}
              <br />
              <b-taglist>
                <b-tag
                  v-if="props.row.rawInput.generate.api.generate"
                  type="is-primary is-light"
                >
                  API
                </b-tag>
                <b-tag
                  v-if="props.row.rawInput.generate.spa.generate"
                  type="is-primary is-light"
                >
                  SPA
                </b-tag>
                <b-tag v-if="props.row.isHosted" type="is-primary is-light">
                  Hosted
                </b-tag>
              </b-taglist>
            </b-table-column>
            <b-table-column field="status" label="Status" v-slot="props">
              <b-tag
                icon="sync"
                v-if="props.row.status === 'queued'"
                class="is-warning is-light"
              >
                {{ capitalize(props.row.status) }}
              </b-tag>
              <b-tag
                icon="check"
                v-if="props.row.status === 'done'"
                class="is-success is-light"
              >
                {{ capitalize(props.row.status) }}
              </b-tag>
              <b-tag
                icon="close"
                v-if="props.row.status === 'failed'"
                class="is-danger is-light"
              >
                {{ capitalize(props.row.status) }}
              </b-tag>
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
                  @click="show(props.row.id)"
                  aria-role="showitem"
                >
                  Show
                </b-dropdown-item>
                <b-dropdown-item @click="prefill(props.row.id)">
                  Prefill
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="
                    props.row.rawInput.generate.spa.generate &&
                    props.row.rawInput.generate.api.generate &&
                    props.row.status === 'done'
                  "
                  @click="
                    props.row.isHosted
                      ? stopHosting(props.row.id)
                      : startHosting(props.row.id)
                  "
                >
                  {{ props.row.isHosted ? "Stop" : "Start" }} Hosting
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="props.row.isHosted"
                  @click="visit(props.row)"
                >
                  Visit Page
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="
                    props.row.rawInput &&
                    props.row.rawInput.generate.api.generate &&
                    props.row.status === 'done'
                  "
                  @click="download(props.row.id, 'api')"
                >
                  Download API Code
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="
                    props.row.rawInput &&
                    props.row.rawInput.generate.spa.generate &&
                    props.row.status === 'done'
                  "
                  @click="download(props.row.id, 'spa')"
                  aria-role="listitem"
                  >Download SPA Code</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="props.row.status === 'draft'"
                  @click="edit(props.row.id)"
                  aria-role="edititem"
                  >Edit</b-dropdown-item
                >
                <b-dropdown-item
                  v-if="props.row.status === 'draft'"
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

    <div v-if="meta.lastPage > 1" class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <b-pagination
            class="mt-5"
            v-model="currentPageNo"
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
import debounce from "lodash/debounce";
import capitalize from "lodash/capitalize";
import { mapActions, mapState } from "vuex";

export default {
  name: "ProjectList",

  data() {
    return {
      currentPageNo: 1,
      currentPageSize: 10,
      sortBy: "id",
      sortType: "desc",
      filter: {
        name: "",
        status: "",
      },
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
      stopHostingAction: "stopHosting",
      startHostingAction: "startHosting",
      generateSignedUrl: "generateSignedUrl",
    }),

    capitalize,

    _index: debounce(function () {
      this.index();
    }, 500),

    index() {
      const queryParams = {
        pageSize: this.currentPageSize,
        pageNo: this.currentPageNo,
        sortBy: this.sortBy,
        sortType: this.sortType,
      };
      if (this.filter.name) queryParams.name = this.filter.name;
      if (this.filter.status) queryParams.status = this.filter.status;
      this.indexAction(queryParams);
    },

    edit(projectId) {
      this.$router.push(`/project/${projectId}/edit`);
    },

    show(projectId) {
      this.$router.push(`/project/${projectId}`);
    },

    prefill(projectId) {
      this.$router.push(`/project/${projectId}/edit`);
    },

    sort(sortBy, sortType) {
      this.sortBy = sortBy;
      this.sortType = sortType;
      this.index();
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

    visit(project) {
      // TODO update it
      return window.open(
        `https://${window.location.hostname}:${10000 + project.id}`
      );
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

    async startHosting(id) {
      try {
        await this.startHostingAction({ id });
        this.$buefy.toast.open({
          message: "Started hosting process",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        console.error(e);
        this.$buefy.toast.open({
          message: "Unable to start hosting",
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },

    async stopHosting(id) {
      try {
        await this.stopHostingAction({ id });
        this.$buefy.toast.open({
          message: "Hosting stopped",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        console.error(e);
        this.$buefy.toast.open({
          message: "Unable to stop hosting",
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },

  watch: {
    async currentPageNo() {
      return this.index();
    },
    async currentPageSize() {
      return this._index();
    },

    "filter.name": function () {
      this._index();
    },
    "filter.status": function () {
      this._index();
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
