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

    <form method="POST" @submit.prevent="store">
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
            <div class="columns">
              <div class="column">
                <b-field label="Name *">
                  <b-input v-model="projectInput.name" required></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Database *">
                  <b-select expanded placeholder="Select Database" required>
                    <option value="mysql">MySQL</option>
                    <option value="pg">PostgreSQL</option>
                  </b-select>
                </b-field>
              </div>
            </div>

            <b-field
              label="Select Project Type *"
              message="It can be API or SSR or both"
            >
              <b-taginput
                v-model="projectInput.types"
                :data="filteredTypes"
                autocomplete
                placeholder="Select Project Type"
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

            <div class="has-background-light p-2 mt-4">
              <h4 class="is-size-6">Name Column Details</h4>
              <div class="columns">
                <div class="column">
                  <b-field label="Min Length *">
                    <b-input
                      v-model="
                        projectInput.auth.table.columns[0].meta.minLength
                      "
                    ></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Max Length *">
                    <b-input
                      v-model="
                        projectInput.auth.table.columns[0].meta.maxLength
                      "
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </div>

            <div class="has-background-light mt-4 p-2">
              <h4 class="is-size-6">Email Column Details</h4>
              <div class="columns">
                <div class="column">
                  <b-field label="Min Length *">
                    <b-input
                      v-model="
                        projectInput.auth.table.columns[1].meta.minLength
                      "
                    ></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Max Length *">
                    <b-input
                      v-model="
                        projectInput.auth.table.columns[1].meta.maxLength
                      "
                    ></b-input>
                  </b-field>
                </div>
              </div>
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
                    <b-input v-model="column.meta.minLength"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Max Length">
                    <b-input v-model="column.meta.maxLength"></b-input>
                  </b-field>
                </div>
              </div>
              <div v-if="column.type === 'string'" class="columns">
                <div class="column">
                  <b-field
                    label="DB Length"
                    message="For fields like password with having different length at DB level and UI level"
                  >
                    <b-input v-model="column.meta.dbLength"></b-input>
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

              <b-field
                message="Default value will be set at database level"
                label="Default Value"
              >
                <b-input
                  v-if="column.type === 'string'"
                  v-model="column.meta.defaultTo"
                ></b-input>
                <b-input
                  v-if="column.type === 'integer'"
                  v-model="column.meta.defaultTo"
                  type="number"
                >
                </b-input>
                <b-input
                  v-if="column.type === 'decimal'"
                  v-model="column.meta.defaultTo"
                  type="number"
                >
                </b-input>
                <b-switch
                  v-if="column.type === 'boolean'"
                  v-model="column.meta.defaultTo"
                  >{{ column.meta.defaultTo }}
                </b-switch>
                <b-datepicker
                  v-if="column.type === 'date'"
                  v-model="column.meta.defaultTo"
                  >{{ column.meta.defaultTo }}</b-datepicker
                >
              </b-field>

              <b-field v-if="column.type === 'string'">
                <b-checkbox v-model="column.meta.multiline"
                  >Multiline</b-checkbox
                >
              </b-field>
              <b-field message="Generate form">
                <b-checkbox v-model="column.meta.expose">Expose</b-checkbox>
              </b-field>
              <b-field
                message="These fields won't return in response, ex: password"
              >
                <b-checkbox v-model="column.meta.secret">Secret</b-checkbox>
              </b-field>
              <b-field message="Create database index for faster searching">
                <b-checkbox v-model="column.meta.index">Index</b-checkbox>
              </b-field>

              <div v-if="webOrSpa">
                <h2>Input Field Details</h2>
                <div class="columns">
                  <div class="column">
                    <b-field label="Input Type *">
                      <b-select
                        v-model="column.input.type"
                        placeholder="Select input type"
                        expanded
                        required
                      >
                        <option
                          v-for="(inputType, inputTypeIndex) in inputTypes"
                          :key="inputTypeIndex"
                        >
                          {{ inputType }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column">
                    <b-field
                      label="Display Name"
                      message="This will be used as label in UI"
                    >
                      <b-input v-model="column.input.displayName"></b-input>
                    </b-field>
                  </div>
                </div>

                <div v-if="column.input.type === 'select'">
                  <div class="columns">
                    <div class="column">
                      <b-field
                        label="Options Type *"
                        message="Select if options are array of strings or array of objects(label, value). In string what is displayed in dropdown is also sent in API call. Label will be displayed to user and value will be sent to backend."
                      >
                        <b-select expanded>
                          <option value="string">String</option>
                          <option value="kv">Key/Value</option>
                        </b-select>
                      </b-field>
                    </div>
                  </div>
                </div>
              </div>

              <h2>Validation</h2>
              <b-field
                v-if="column.type === 'string'"
                message="Check if field type is email"
              >
                <b-checkbox v-model="column.meta.email">Email</b-checkbox>
              </b-field>
            </div>

            <b-button @click="addColumn(table)">Add Column</b-button>
          </div>
        </div>
      </b-collapse>

      <b-button native-type="submit" type="is-primary is-fullwidth mt-4">
        Generate
      </b-button>
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
      inputTypes: ["input", "select", "radio", "checkbox", "file"],
      projectInput: {
        name: "",
        database: "mysql",
        types: ["api"],
        camelCaseStrategy: false,
        tech: {
          backend: "adonis",
          frontend: "buefy",
        },
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
            operations: [],
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
                input: {
                  type: "input",
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
                input: {
                  type: "input",
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
                input: {
                  type: "input",
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
        await this.storeAction(this.projectInput);
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
            input: {
              type: "input",
            },
          },
        ],
      });
    },

    addColumn(table) {
      table.columns.push({
        meta: {
          required: false,
          expose: true,
        },
        input: {
          type: "input",
        },
        select: {
          types: ["object", "string", "number"],
          type: "object",
          options: [],
        },
        radio: {
          options: [],
        },
        checkbox: {
          options: [],
        },
      });
    },
  },

  computed: {
    filteredTypes() {
      return ["api", "ssr"];
    },
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
    webOrSpa: function () {
      return (
        this.projectInput.generate.spa.generate ||
        this.projectInput.generate.website.generate
      );
    },
  },
};
</script>
