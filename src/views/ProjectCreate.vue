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
              </div>
            </div>

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

            <div class="level">
              <div class="level-left is-size-4">Relations</div>
              <div class="level-right">
                <b-button
                  @click="addRelation(projectInput.auth.table)"
                  type="is-light"
                >
                  Add New Relation
                </b-button>
              </div>
            </div>
            <div
              class="columns"
              v-for="(relation, relationIndex) in projectInput.auth.table
                .relations"
              :key="'relationIndex' + relationIndex"
            >
              <div class="column">
                <b-field label="Relation Type *">
                  <b-select v-model="relation.type" expanded required>
                    <option value="hasOne">Has One</option>
                    <option value="hasMany">Has Many</option>
                    <option value="manyToMany">Many to many</option>
                    <option value="belongsTo">Belongs To</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Table *">
                  <b-select v-model="relation.withModel" expanded required>
                    <option value="$auth">
                      {{ projectInput.auth.table.name }} (Auth)
                    </option>
                    <option
                      v-for="(t, ti) in projectInput.tables"
                      :key="'ti' + ti"
                    >
                      {{ t.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  label="Relation Name"
                  message="Optional relation name in camelCase/PascalCase"
                >
                  <b-input v-model="relation.name"></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Required">
                  <b-checkbox v-model="relation.required">Required</b-checkbox>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Remove">
                  <b-button
                    @click="
                      removeRelation(projectInput.auth.table, relationIndex)
                    "
                    class="is-danger is-light is-fullwidth"
                    >Delete this relation</b-button
                  >
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="has-background-light m-1 column">
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

              <div class="has-background-light m-1 column">
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
            <p class="card-header-title">Tenant Options</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <div class="columns">
              <div class="column">
                <b-field label="Tenant/Company *">
                  <b-select
                    v-model="projectInput.tenantSettings.tenant"
                    expanded
                  >
                    <option :value="0">No Tenant</option>
                    <option :value="1">One Tenant</option>
                    <option value="n">Many Tenant</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="User *">
                  <b-select
                    :disabled="!projectInput.tenantSettings.tenant"
                    v-model="projectInput.tenantSettings.user"
                    expanded
                  >
                    <option :value="1">One User</option>
                    <option value="n">Many Users</option>
                  </b-select>
                </b-field>
              </div>
            </div>
            <div
              v-if="
                projectInput.tenantSettings.tenant && projectInput.tables.length
              "
              class="columns"
            >
              <div class="column">
                <b-field label="Tenant Table">
                  <b-select
                    v-model="projectInput.tenantSettings.table"
                    expanded
                    required
                  >
                    <option
                      v-for="(t, ti) in projectInput.tables"
                      :key="'ti' + ti"
                    >
                      {{ t.name }}
                    </option>
                  </b-select>
                </b-field>
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
            <b-field label="Database *">
              <b-select
                v-model="projectInput.database"
                placeholder="Select Database"
                expanded
                required
              >
                <option value="mysql">MySQL</option>
                <option value="pg">PostgreSQL</option>
              </b-select>
            </b-field>
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
          <div class="level">
            <div class="level-left is-size-4">Tables</div>
            <div class="level-right">
              <b-button @click="addTable" type="is-light">
                Add New Table
              </b-button>
            </div>
          </div>
          <div class="content">
            <div class="buttons">
              <b-button
                v-for="(table, tableIndex) in projectInput.tables"
                :key="'tableIndex' + tableIndex"
                :label="table.name"
                @click="removeTable(tableIndex)"
                type="is-primary is-light"
                icon-right="close"
              />
            </div>
          </div>
        </div>
      </b-collapse>

      <b-collapse
        class="card mt-5"
        animation="slide"
        aria-id="contentIdForA11y3"
        v-for="(table, tableIndex) in projectInput.tables"
        :key="'tableIndex' + tableIndex"
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

            <div class="level">
              <div class="level-left is-size-4">Relations</div>
              <div class="level-right">
                <b-button @click="addRelation(table)" type="is-light">
                  Add New Relation
                </b-button>
              </div>
            </div>
            <div
              class="columns"
              v-for="(relation, relationIndex) in table.relations"
              :key="'relationIndex' + relationIndex"
            >
              <div class="column">
                <b-field label="Relation Type *">
                  <b-select v-model="relation.type" expanded>
                    <option value="hasOne">Has One</option>
                    <option value="hasMany">Has Many</option>
                    <option value="manyToMany">Many to many</option>
                    <option value="belongsTo">Belongs To</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Table *">
                  <b-select v-model="relation.withModel" expanded>
                    <option value="$auth">
                      {{ projectInput.auth.table.name }} (Auth)
                    </option>
                    <option
                      v-for="(t, ti) in projectInput.tables"
                      :key="'ti' + ti"
                    >
                      {{ t.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  label="Relation Name"
                  message="Optional relation name in camelCase/PascalCase"
                >
                  <b-input v-model="relation.name"></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Required">
                  <b-checkbox v-model="relation.required">Required</b-checkbox>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Remove">
                  <b-button
                    @click="removeRelation(table, relationIndex)"
                    class="is-danger is-light is-fullwidth"
                    >Delete this relation</b-button
                  >
                </b-field>
              </div>
            </div>

            <div class="level">
              <div class="level-left is-size-4">Columns</div>
              <div class="level-right">
                <b-button @click="addColumn(table)" type="is-light">
                  Add New Columns
                </b-button>
              </div>
            </div>

            <b-collapse
              animation="slide"
              class="has-background-light mt-4"
              v-for="(column, columnIndex) in table.columns"
              :key="'columnIndex' + columnIndex"
            >
              <template #trigger>
                <div
                  class="panel-heading"
                  role="button"
                  aria-controls="contentIdForA11y2"
                >
                  <strong>{{ column.name }}</strong>
                </div>
              </template>
              <div class="panel-body p-4">
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
                          :key="'typeIndex' + typeIndex"
                        >
                          {{ type }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column">
                    <b-field label="Remove">
                      <b-button
                        @click="removeColumn(table, columnIndex)"
                        type="is-dark is-fullwidth"
                      >
                        Remove Column
                      </b-button>
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

                <b-field v-if="column.type === 'decimal'" label="Step">
                  <b-input
                    v-model="column.input.decimal.step"
                    step="any"
                    message="Change any to step value you want to use"
                  ></b-input>
                </b-field>
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
                <b-field>
                  <b-checkbox v-model="column.meta.required">
                    Required *
                  </b-checkbox>
                </b-field>

                <b-field v-if="column.type === 'string'">
                  <b-checkbox v-model="column.meta.trim">Trim</b-checkbox>
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
                            :key="'inputTypeIndex' + inputTypeIndex"
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
                          <b-select v-model="column.input.select.type" expanded>
                            <option value="string">String</option>
                            <option value="kv">Key/Value</option>
                          </b-select>
                        </b-field>
                      </div>
                    </div>

                    <div
                      class="columns"
                      v-if="column.input.select.type === 'string'"
                    >
                      <div class="column">
                        <b-field label="Add Options">
                          <b-taginput
                            v-model="column.input.select.options"
                            placeholder="Options"
                            aria-close-label="Remove this option"
                          >
                          </b-taginput>
                        </b-field>
                      </div>
                    </div>

                    <div v-if="column.input.select.type === 'kv'">
                      <div class="columns">
                        <div class="column">
                          <b-button @click="addSelectOption(column)"
                            >Add An Option</b-button
                          >
                        </div>
                      </div>
                      <div
                        class="columns"
                        v-for="(option, optionIndex) in column.input.select
                          .options"
                        :key="'optionIndex' + optionIndex"
                      >
                        <div class="column">
                          <b-field label="Label">
                            <b-input
                              v-model="option.label"
                              placeholder="Label"
                              aria-close-label="Remove this option"
                            >
                            </b-input>
                          </b-field>
                        </div>
                        <div class="column">
                          <b-field label="Value">
                            <b-input
                              v-model="option.value"
                              placeholder="Value"
                              aria-close-label="Remove this option"
                            >
                            </b-input>
                          </b-field>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="column.input.type === 'radio'">
                    <div class="columns">
                      <div class="column">
                        <b-field
                          label="Options Type *"
                          message="Select if options are array of strings or array of objects(label, value). In string what is displayed in dropdown is also sent in API call. Label will be displayed to user and value will be sent to backend."
                        >
                          <b-select v-model="column.input.radio.type" expanded>
                            <option value="string">String</option>
                            <option value="kv">Key/Value</option>
                          </b-select>
                        </b-field>
                      </div>
                    </div>

                    <div
                      class="columns"
                      v-if="column.input.radio.type === 'string'"
                    >
                      <div class="column">
                        <b-field label="Add Options">
                          <b-taginput
                            v-model="column.input.radio.options"
                            placeholder="Options"
                            aria-close-label="Remove this option"
                          >
                          </b-taginput>
                        </b-field>
                      </div>
                    </div>

                    <div v-if="column.input.radio.type === 'kv'">
                      <div class="columns">
                        <div class="column">
                          <b-button @click="addRadioOption(column)"
                            >Add An Option</b-button
                          >
                        </div>
                      </div>
                      <div
                        class="columns"
                        v-for="(option, optionIndex) in column.input.radio
                          .options"
                        :key="'optionIndex' + optionIndex"
                      >
                        <div class="column">
                          <b-field label="Label">
                            <b-input
                              v-model="option.label"
                              placeholder="Label"
                              aria-close-label="Remove this option"
                            >
                            </b-input>
                          </b-field>
                        </div>
                        <div class="column">
                          <b-field label="Value">
                            <b-input
                              v-model="option.value"
                              placeholder="Value"
                              aria-close-label="Remove this option"
                            >
                            </b-input>
                          </b-field>
                        </div>
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
            </b-collapse>
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
        camelCaseStrategy: true,
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
            relations: [],
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
        tenantSettings: {
          user: 1,
          tenant: 1,
          table: null,
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
        // this.$router.push("/project");
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
        columns: [],
        relations: [],
      });
    },

    removeTable(index) {
      this.projectInput.tables.splice(index, 1);
    },

    removeRelation(table, relationIndex) {
      table.relations.splice(relationIndex, 1);
    },

    removeColumn(table, columnIndex) {
      table.columns.splice(columnIndex, 1);
    },

    addColumn(table) {
      table.columns.push({
        meta: {
          required: false,
          expose: true,
          trim: false,
        },
        input: {
          type: "input",
          decimal: {
            step: "any",
          },
          select: {
            types: ["object", "string", "number"],
            type: "string",
            options: [],
          },
          radio: {
            types: ["object", "string", "number"],
            type: "string",
            options: [],
          },
          checkbox: {
            options: [],
          },
        },
      });
    },

    addSelectOption(column) {
      column.input.select.options.push({ value: "", label: "" });
    },

    addRadioOption(column) {
      column.input.radio.options.push({ value: "", label: "" });
    },

    addRelation(table) {
      table.relations.push({
        type: "oneToOne",
        withModel: null,
        name: "",
        required: true, // Only applicable to belongsTo
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
