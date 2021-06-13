<template>
  <section class="container my-5">
    <div class="level">
      <div class="level-left is-size-3">Create Project</div>
      <div class="level-right">
        <b-button tag="router-link" to="/dashboard" type="is-white">
          Back
        </b-button>
      </div>
    </div>

    <form method="POST" @submit.prevent="generate">
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Project Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field label="Name *">
              <b-input v-model="projectInput.name" required></b-input>
            </b-field>

            <b-field label="Database *">
              <b-select expanded placeholder="Select Database" required>
                <option value="mysql">MySQL</option>
                <option value="pg">PostgreSQL</option>
              </b-select>
            </b-field>

            <b-field
              label="Select Project Type *"
              message="It can be API or SSR or both"
            >
              <b-taginput
                v-model="projectInput.types"
                autocomplete
                placeholder="Select Project Type"
                required
              >
              </b-taginput>
            </b-field>

            <b-field
              label="Camelcase / Snakcase Convention *"
              message="Database table and columnName is based on this, Code is always camelCase"
            >
              <b-checkbox v-model="projectInput.camelCaseStrategy">
                {{
                  projectInput.camelCaseStrategy ? "camelCase" : "snake_case"
                }}
              </b-checkbox>
            </b-field>

            <b-field>
              <b-checkbox v-model="projectInput.generate.api.generate">
                Generate API
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="projectInput.generate.spa.generate">
                Generate SPA
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox
                disabled
                v-model="projectInput.generate.website.generate"
              >
                Generate Traditional Website (Not available yet)
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox disabled v-model="projectInput.generate.app.generate">
                Generate App (Not available yet)
              </b-checkbox>
            </b-field>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Auth Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field
              v-if="webOrApi"
              label="Auth Table *"
              message="Use PascalCase, it will be internally converted according to conventions"
            >
              <b-input
                v-model="projectInput.auth.table.name"
                required
              ></b-input>
            </b-field>

            <b-field>
              <b-checkbox v-model="projectInput.auth.register">
                Generate Register Page
              </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="projectInput.auth.table.timestamps">
                Generate Timestamps
              </b-checkbox>
            </b-field>

            <div class="has-background-light p-2">
              <b-field label="Min Length *">
                <b-input
                  v-model="projectInput.auth.table.columns[0].meta.minlength"
                ></b-input>
              </b-field>
              <b-field label="Max Length *">
                <b-input
                  v-model="projectInput.auth.table.columns[0].meta.maxlength"
                ></b-input>
              </b-field>
            </div>

            <h4 class="is-size-6 mt-4">Email Column Details</h4>
            <div class="has-background-light p-2">
              <b-field label="Min Length *">
                <b-input
                  v-model="projectInput.auth.table.columns[1].meta.minlength"
                ></b-input>
              </b-field>
              <b-field label="Max Length *">
                <b-input
                  v-model="projectInput.auth.table.columns[1].meta.maxlength"
                ></b-input>
              </b-field>
            </div>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">API Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field label="Generate CRUD">
              <b-checkbox v-model="projectInput.generate.api.crud">
                Generate CRUD APIs
              </b-checkbox>
            </b-field>
            <b-field label="Generate Tests">
              <b-checkbox v-model="projectInput.generate.api.test">
                Generate Tests (Auth & CRUD)
              </b-checkbox>
            </b-field>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">SPA Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field label="Generate CRUD UI">
              <b-checkbox v-model="projectInput.generate.spa.crud">
                Generate CRUD
              </b-checkbox>
            </b-field>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">CRUD Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <ol>
              <li v-for="(table, index) in projectInput.tables" :key="index">
                {{ table.name }}
              </li>
            </ol>
            <b-button @click="addTable" type="is-primary is-fullwidth mt-4">
              Add New Table
            </b-button>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
        v-for="(table, tableIndex) in projectInput.tables"
        :key="tableIndex"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">{{ table.name }} Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field label="Table Name *">
              <b-input v-model="table.name" required></b-input>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="projectInput.auth.table.timestamps">
                Generate Timestamps
              </b-checkbox>
            </b-field>

            <div
              class="has-background-light p-2 mt-5"
              v-for="(column, columnIndex) in table.columns"
              :key="columnIndex"
            >
              <div class="columns">
                <div class="column">
                  <b-field label="Column Name *">
                    <b-input v-model="column.name"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Column Type *">
                    <b-select
                      v-model="column.type"
                      placeholder="Select a name"
                      expanded
                      required
                    >
                      <option
                        v-for="(type, typeIndex) in types"
                        :key="typeIndex"
                      >
                        {{ type }}
                      </option>
                    </b-select>
                  </b-field>
                </div>
              </div>

              <div v-if="column.type === 'string'" class="columns">
                <div class="column">
                  <b-field label="Min Length">
                    <b-input v-model="column.meta.minlength"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Max Length">
                    <b-input v-model="column.meta.maxlength"></b-input>
                  </b-field>
                </div>
              </div>

              <div
                v-if="['decimal', 'integer'].includes(column.type)"
                class="columns"
              >
                <div class="column">
                  <b-field label="Min">
                    <b-input v-model="column.meta.min"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Max">
                    <b-input v-model="column.meta.max"></b-input>
                  </b-field>
                </div>
              </div>
              <b-field v-if="column.type === 'string'">
                <b-checkbox v-model="column.meta.multiline"
                  >Multiline</b-checkbox
                >
              </b-field>
              <b-field message="Generate form">
                <b-checkbox v-model="column.meta.expose">Expose</b-checkbox>
              </b-field>
              <b-field
                message="Some fields like password have different length at DB level and UI level"
              >
                <b-checkbox v-model="column.meta.dbLength"
                  >DB Length</b-checkbox
                >
              </b-field>
              <b-field
                message="These fields won't return in response, ex: password"
              >
                <b-checkbox v-model="column.meta.secret">Secret</b-checkbox>
              </b-field>
              <b-field message="Create database index for faster searching">
                <b-checkbox v-model="column.meta.index">Index</b-checkbox>
              </b-field>
              <b-field message="Default value will be set at database level">
                <b-input v-model="column.meta.index"></b-input>
              </b-field>
            </div>

            <b-button @click="addColumn(table)">Add Column</b-button>
          </div>
        </div>
      </b-collapse>

      <b-button type="is-primary is-fullwidth mt-4">Generate</b-button>
    </form>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "../exceptions/ValidationException";

export default {
  name: "ProjectCreate",
  data() {
    return {
      types: ["string", "decimal", "integer", "date", "boolean"],
      projectInput: {
        name: "",
        database: "mysql",
        types: ["api"],
        camelCaseStrategy: false,
        generate: {
          api: {
            generate: true,
            init: true,
            db: true,
            auth: true,
            crud: true,
            test: true,
          },
          spa: {
            generate: true,
            init: true,
            auth: true,
            crud: true,
          },
          app: {
            generate: false,
          },
          website: {
            generate: false,
          },
        },
        auth: {
          register: true,
          table: {
            name: "User",
            timestamps: true,
            columns: [
              {
                name: "name",
                type: "string",
                meta: {
                  displayName: "Name",
                  required: true,
                  minLength: 2,
                  maxLength: 127,
                },
              },
              {
                name: "email",
                type: "string",
                meta: {
                  displayName: "Email",
                  required: true,
                  minLength: 6,
                  maxLength: 127,
                  email: true,
                  unique: true,
                },
              },
              {
                name: "password",
                type: "string",
                meta: {
                  displayName: "Password",
                  trim: true,
                  secret: true,
                  maxLength: 64,
                  minLength: 8,
                  dbLength: 255,
                  required: true,
                },
              },
              {
                name: "rememberMeToken",
                type: "string",
                meta: {
                  expose: false,
                  required: false,
                },
              },
            ],
          },
        },
        tables: [],
      },
    };
  },

  methods: {
    ...mapActions("project", {
      storeAction: "store",
    }),

    async store() {
      try {
        await this.storeAction({
          name: this.form.name,
        });
        this.$router.push("/project");
        this.$buefy.toast.open({
          message: "project created",
          position: "is-bottom-right",
          type: "is-success",
        });
      } catch (e) {
        let message = "Unable to create project";
        if (e instanceof ValidationException) {
          this.errors = e.errors;
          message = "Validation failed";
        }
        this.$buefy.toast.open({
          message,
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },

    addTable() {
      this.projectInput.tables.push({
        name: "Country",
        timestamps: true,
        operations: [
          "index",
          "store",
          "update",
          "destroy",
          "storeMany",
          "destroyMany",
        ],
        columns: [
          {
            name: "name",
            type: "string",
            meta: {
              displayName: "Name",
              required: true,
              minLength: 2,
              maxLength: 127,
            },
          },
        ],
      });
    },

    addColumn(table) {
      table.columns.push({
        meta: {
          required: false,
        },
      });
    },
  },

  computed: {
    ...mapState("auth", {
      user: (state) => state.user,
    }),
    ...mapState("project", {
      countries: (state) => state.items,
      loading: (state) => state.loading,
    }),
    isLoading() {
      return this.loading.store || this.loading.update;
    },
    webOrApi: function () {
      return (
        this.projectInput.generate.api.generate ||
        this.projectInput.generate.website.generate
      );
    },
  },
};
</script>
