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

    <b-notification
      type="is-info"
      aria-close-label="Close notification"
      role="alert"
    >
      User <strong>singular pascal case</strong> to avoid build failure
    </b-notification>

    <form method="POST" @submit.prevent="store">
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Project</p>
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
            <p class="card-header-title">Storage (File Upload)</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field>
              <b-checkbox
                native-value="local"
                v-model="projectInput.storageEnabled"
                >Storage Enabled</b-checkbox
              >
            </b-field>
            <template v-if="projectInput.storageEnabled">
              <b-field label="Select Storage Drivers">
                <b-checkbox
                  native-value="Local"
                  v-model="projectInput.storageDrivers"
                  >Local</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox
                  native-value="S3"
                  v-model="projectInput.storageDrivers"
                  >AWS S3</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox
                  native-value="GCS"
                  v-model="projectInput.storageDrivers"
                  >Google Cloud Storage</b-checkbox
                >
              </b-field>
              <b-field
                v-if="projectInput.storageDrivers.length"
                label="Default Storage Driver"
              >
                <b-select v-model="projectInput.defaultStorageDriver" expanded>
                  <option
                    v-if="projectInput.storageDrivers.includes('Local')"
                    value="Local"
                  >
                    Local
                  </option>
                  <option
                    v-if="projectInput.storageDrivers.includes('S3')"
                    value="S3"
                  >
                    AWS S3
                  </option>
                  <option
                    v-if="projectInput.storageDrivers.includes('GCS')"
                    value="GCS"
                  >
                    Google Cloud Storage
                  </option>
                </b-select>
              </b-field>
            </template>
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
            <p class="card-header-title">Auth</p>
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

            <b-field>
              <b-checkbox v-model="projectInput.auth.passwordReset">
                Generate Password Reset
              </b-checkbox>
            </b-field>

            <b-field>
              <b-checkbox v-model="projectInput.auth.passwordChange">
                Generate Password Change
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
                    <option value="HasOne">Has One</option>
                    <option value="HasMany">Has Many</option>
                    <option value="ManyToMany">Many To Many</option>
                    <option value="BelongsTo">Belongs To</option>
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
                    >Delete relation</b-button
                  >
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
            <p class="card-header-title">RBAC</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field>
              <b-checkbox v-model="projectInput.rbac.enabled">
                Enabled RBAC (Role &amp; permission system)
              </b-checkbox>
            </b-field>

            <template v-if="projectInput.rbac.enabled">
              <b-field>
                <b-checkbox v-model="projectInput.rbac.multipleRoles">
                  Can one user have multiple roles?
                </b-checkbox>
              </b-field>

              <div class="level">
                <div class="level-left is-size-4">Roles</div>
                <div class="level-right">
                  <b-button @click="addRole" type="is-light">Add Role</b-button>
                </div>
              </div>

              <div
                class="columns"
                v-for="(role, roleIndex) in projectInput.rbac.roles"
                :key="'roleIndex' + roleIndex"
              >
                <div class="column">
                  <b-field label="Name" message="Name fo the role">
                    <b-input v-model="role.name"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field
                    label="Description"
                    message="Description of the role"
                  >
                    <b-input v-model="role.description"></b-input>
                  </b-field>
                </div>
                <div class="column">
                  <b-field
                    label="Description"
                    message="Description of the role"
                  >
                    <b-switch v-model="role.default">Default</b-switch>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Remove">
                    <b-button
                      @click="removeRole(roleIndex)"
                      class="is-danger is-light is-fullwidth"
                      >Delete Role</b-button
                    >
                  </b-field>
                </div>
              </div>

              <b-field label="Permissions">
                <b-taginput
                  v-model="projectInput.rbac.permissions"
                  ellipsis
                  field="name"
                  icon="label"
                  placeholder="Permissions"
                  aria-close-label="Remove this permission"
                >
                </b-taginput>
              </b-field>

              <b-button
                @click="generatePermissionsAndMatrix"
                v-if="projectInput.rbac.enabled"
                type="is-light"
              >
                Generate All Permissions
              </b-button>

              <template
                v-if="
                  Array.isArray(projectInput.rbac.permissions) &&
                  projectInput.rbac.permissions.length
                "
              >
                <h4 class="mt-5">Role &amp; Permission Matrix</h4>
                <table class="is-bordered is-hoverable">
                  <thead>
                    <tr>
                      <th>Permission</th>
                      <th
                        v-for="(role, roleIndex) in projectInput.rbac.matrix"
                        :key="'role_' + roleIndex"
                      >
                        <b-tooltip
                          label="Click to grant all permisson to this role"
                        >
                          <b-button
                            type="is-ghost"
                            @click="grantAllPermissionToRole(role)"
                          >
                            <b-icon
                              icon="checkbox-marked"
                              type="is-success"
                              size="is-medium"
                            ></b-icon>
                          </b-button>
                        </b-tooltip>
                        {{ role.role }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="permission in projectInput.rbac.permissions"
                      :key="permission.name"
                    >
                      <td>{{ permission.name }}</td>
                      <td
                        v-for="(role, roleIndex) in projectInput.rbac.matrix"
                        :key="'role_' + roleIndex"
                      >
                        <b-button
                          type="is-ghost"
                          @click="
                            togglePermission(
                              projectInput.rbac.matrix[roleIndex],
                              permission
                            )
                          "
                        >
                          <b-icon
                            :icon="
                              hasPermission(
                                projectInput.rbac.matrix[roleIndex],
                                permission
                              )
                                ? 'checkbox-marked'
                                : 'close-box'
                            "
                            :type="
                              hasPermission(
                                projectInput.rbac.matrix[roleIndex],
                                permission
                              )
                                ? 'is-success'
                                : 'is-danger'
                            "
                            size="is-medium"
                          ></b-icon>
                        </b-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </template>
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
            <p class="card-header-title">Mailer</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>

        <div class="card-content">
          <div class="content">
            <b-field>
              <b-checkbox v-model="projectInput.mailEnabled"
                >Enable Mailer</b-checkbox
              >
            </b-field>

            <template v-if="projectInput.mailEnabled">
              <b-field label="Select Mail Drivers">
                <b-checkbox native-value="SMTP" v-model="projectInput.mailers"
                  >SMTP</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox native-value="SES" v-model="projectInput.mailers"
                  >SES</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox
                  native-value="Mailgun"
                  v-model="projectInput.mailers"
                  >Mailgun</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox
                  native-value="SparkPost"
                  v-model="projectInput.mailers"
                  >Sparkpost</b-checkbox
                >
              </b-field>
              <b-field
                v-if="projectInput.mailers.length"
                label="Default Mailer"
              >
                <b-select v-model="projectInput.defaultMailer" expanded>
                  <option
                    v-if="projectInput.mailers.includes('SMTP')"
                    value="SMTP"
                  >
                    SMTP
                  </option>
                  <option
                    v-if="projectInput.mailers.includes('SES')"
                    value="SES"
                  >
                    SES
                  </option>
                  <option
                    v-if="projectInput.mailers.includes('Mailgun')"
                    value="Mailgun"
                  >
                    Mailgun
                  </option>
                  <option
                    v-if="projectInput.mailers.includes('SparkPost')"
                    value="SparkPost"
                  >
                    Sparkpost
                  </option>
                </b-select>
              </b-field>
            </template>
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
            <p class="card-header-title">Tenant</p>
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
        v-if="false"
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
        v-if="false"
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
            <p class="card-header-title">Tables</p>
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
              <b-checkbox v-model="table.generateController">
                Generate Controller
              </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.generateModel">
                Generate Model
              </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.generateMigration">
                Generate Migration
              </b-checkbox>
            </b-field>

            <b-field v-if="projectInput.generate.spa">
              <b-checkbox v-model="table.generateUI"> Generate UI </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.timestamps">
                Generate Timestamps
              </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.generateRoute">
                Generate Route
              </b-checkbox>
            </b-field>

            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.singleton">Singleton</b-checkbox>
            </b-field>

            <b-field v-if="webOrApi" label="Basic Operations">
              <b-checkbox v-model="table.operations.index">
                Index <span class="has-text-grey">(List)</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.create">
                Create
                <span class="has-text-grey">Show Input Page For Create</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.store">
                Store <span class="has-text-grey">(Save)</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.show">
                Show
                <span class="has-text-grey">View full detail</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.edit">
                Edit <span class="has-text-grey">Show page for edit</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.update">
                Update
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.destroy">
                Destroy <span class="has-text-grey">(Delete One)</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.storeMany">
                Store Many
                <span class="has-text-grey">(Can be used for bulk upload)</span>
              </b-checkbox>
            </b-field>
            <b-field v-if="webOrApi">
              <b-checkbox v-model="table.operations.destroyMany">
                Destroy Many
                <span class="has-text-grey"
                  >(Can be used or selecting and deleting multiple items at one
                  time)</span
                >
              </b-checkbox>
            </b-field>

            <b-field label="Parent *" v-if="webOrApi && table.singleton">
              <b-select expanded v-model="table.parent">
                <option :value="null">No Parent(Global Singleton)</option>
                <option
                  v-for="(
                    routeBelongsTo, routeBelongsToIndex
                  ) in getBelongsToListFull(table)"
                  :key="routeBelongsToIndex"
                >
                  {{ routeBelongsTo.withModel }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Columns to show on Listing">
              <b-taginput
                v-model="table.indexColumns"
                ellipsis
                autocomplete
                icon="label"
                placeholder="Select columns"
                aria-close-label="Remove this column"
                :data="getColumnsForTable(table)"
              >
              </b-taginput>
            </b-field>

            <div
              class="columns"
              v-if="table.generateRoute && getBelongsToList(table).length"
            >
              <div class="column">
                <b-field label="Level 1 route nesting">
                  <b-select expanded v-model="table.routeParents[0]">
                    <option
                      v-for="(
                        routeBelongsTo, routeBelongsToIndex
                      ) in getBelongsToList(table)"
                      :key="routeBelongsToIndex"
                    >
                      {{ routeBelongsTo.withModel }}
                    </option>
                  </b-select>
                </b-field>
              </div>
            </div>

            <div class="level">
              <div class="level-left is-size-4">Custom Operations</div>
              <div class="level-right">
                <b-button @click="addCustomOperation(table)" type="is-light">
                  Add New Operation
                </b-button>
              </div>
            </div>
            <div
              class="columns"
              v-for="(
                customOperation, customOperationIndex
              ) in table.customOperations"
              :key="'customOperationIndex' + customOperationIndex"
            >
              <div class="column">
                <b-field label="Operation Method *">
                  <b-select v-model="customOperation.method" expanded>
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>PATCH</option>
                    <option>DELETE</option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field
                  label="Operation Name *"
                  message="ex: resolveReport for report resouce"
                >
                  <b-input v-model="customOperation.name"></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Item id required">
                  <b-checkbox v-model="customOperation.singular"
                    >Item id required?</b-checkbox
                  >
                </b-field>
              </div>
              <div class="column">
                <b-field label="Remove">
                  <b-button
                    @click="removeCustomOperation(table, customOperationIndex)"
                    class="is-danger is-light is-fullwidth"
                    >Delete operation?</b-button
                  >
                </b-field>
              </div>
            </div>

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
                    <option value="HasOne">Has One</option>
                    <option value="HasMany">Has Many</option>
                    <option value="ManyToMany">Many to many</option>
                    <option value="BelongsTo">Belongs To</option>
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
                      v-if="projectInput.tenantSettings.table"
                      value="$tenant"
                    >
                      {{ projectInput.tenantSettings.table }} (Tenant)
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
                    >Delete relation</b-button
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
                          v-for="(type, typeIndex) in enums.apiInputType"
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

                <div v-if="column.type === 'String'" class="columns">
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
                <div v-if="column.type === 'String'" class="columns">
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
                  v-if="['Decimal', 'Integer'].includes(column.type)"
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

                <b-field v-if="column.type === 'Decimal'" label="Step">
                  <b-input
                    v-model="column.input.decimal.step"
                    step="any"
                    message="Change any to step value you want to use"
                  ></b-input>
                </b-field>

                <div v-if="column.type === 'File'" class="columns">
                  <div class="column">
                    <b-field label="Max Size (ex: 1mb, 512kb, etc)">
                      <b-input v-model="column.meta.maxSize"></b-input>
                    </b-field>
                  </div>
                  <div class="column">
                    <b-field
                      label="Extensions filter comma [jpg, gif, png, docs, etc]"
                    >
                      <b-taginput
                        v-model="column.meta.extensions"
                        placeholder="Extensions"
                        aria-close-label="Remove this extension"
                      >
                      </b-taginput>
                    </b-field>
                  </div>
                </div>

                <b-field
                  message="Default value will be set at database level"
                  label="Default Value"
                >
                  <b-input
                    v-if="column.type === 'String'"
                    v-model="column.meta.defaultTo"
                  ></b-input>
                  <b-input
                    v-if="column.type === 'Integer'"
                    v-model="column.meta.defaultTo"
                    type="number"
                  >
                  </b-input>
                  <b-input
                    v-if="column.type === 'Decimal'"
                    v-model="column.meta.defaultTo"
                    type="number"
                  >
                  </b-input>
                  <b-switch
                    v-if="column.type === 'Boolean'"
                    v-model="column.meta.defaultTo"
                    >{{ column.meta.defaultTo }}
                  </b-switch>
                  <b-datepicker
                    v-if="column.type === 'Date'"
                    v-model="column.meta.defaultTo"
                    >{{ column.meta.defaultTo }}</b-datepicker
                  >
                </b-field>
                <b-field>
                  <b-checkbox v-model="column.meta.required">
                    Required *
                  </b-checkbox>
                </b-field>

                <b-field v-if="column.type === 'String'">
                  <b-checkbox v-model="column.meta.trim">Trim</b-checkbox>
                </b-field>
                <b-field v-if="column.type === 'String'">
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
                <b-field
                  v-if="!column.meta.secret"
                  message="Allow searching this column from list page"
                >
                  <b-checkbox v-model="column.meta.filterable">
                    Filterable
                  </b-checkbox>
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
                      v-if="column.input.select.type === 'String'"
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
                      v-if="column.input.radio.type === 'String'"
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
                  v-if="column.type === 'String'"
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
import ValidationException from "@/exceptions/ValidationException";
import {
  DATABASE,
  MAILER,
  PROJECT_TYPE,
  STORAGE,
  BACKEND,
  FRONTEND,
  RELATION_TYPE,
  REQUEST_METHOD,
  API_INPUT_TYPE,
  UI_INPUT_TYPE,
} from "../constants/";

export default {
  name: "ProjectCreate",

  created() {
    if (this.$route.params.id) {
      const id = parseInt(this.$route.params.id, 10);
      this.editMode.enabled = true;
      this.editMode.id = id;
      const project = this.items.find((t) => t.id === id);

      // Prefill all the fields
      this.projectInput = JSON.parse(project.rawInput);
    }
  },

  data() {
    return {
      editMode: {
        enabled: false,
        id: null,
      },
      enums: {
        database: [DATABASE.MYSQL, DATABASE.POSTGRESQL],
        mailer: [MAILER.SMTP, MAILER.SES, MAILER.MAILGUN, MAILER.SPARK_POST],
        projectType: [PROJECT_TYPE.API, PROJECT_TYPE.SSR],
        storage: [STORAGE.LOCAL, STORAGE.S3, STORAGE.GCS],
        backend: [BACKEND.ADONIS],
        frontend: [FRONTEND.BUEFY],
        relationType: [
          RELATION_TYPE.HAS_ONE,
          RELATION_TYPE.HAS_MANY,
          RELATION_TYPE.BELONGS_TO,
          RELATION_TYPE.MANY_TO_MANY,
        ],
        requestMethod: [
          REQUEST_METHOD.GET,
          REQUEST_METHOD.POST,
          REQUEST_METHOD.PUT,
          REQUEST_METHOD.PATCH,
          REQUEST_METHOD.DELETE,
        ],
        apiInputType: [
          API_INPUT_TYPE.STRING,
          API_INPUT_TYPE.DECIMAL,
          API_INPUT_TYPE.INTEGER,
          API_INPUT_TYPE.DATE,
          API_INPUT_TYPE.BOOLEAN,
          API_INPUT_TYPE.FILE,
        ],
      },
      inputTypes: [
        UI_INPUT_TYPE.INPUT,
        UI_INPUT_TYPE.SELECT,
        UI_INPUT_TYPE.RADIO,
        UI_INPUT_TYPE.CHECKBOX,
      ], // String input types
      projectInput: {
        name: "",
        database: DATABASE.MYSQL,
        mailEnabled: false,
        defaultMailer: MAILER.SMTP,
        mailers: [MAILER.SMTP],
        storageEnabled: false,
        storageDrivers: [STORAGE.LOCAL],
        defaultStorageDriver: STORAGE.LOCAL,
        types: [PROJECT_TYPE.API],
        camelCaseStrategy: true,

        tech: {
          backend: BACKEND.ADONIS,
          frontend: FRONTEND.BUEFY,
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
          passwordReset: true,
          passwordChange: true,
          table: {
            generateRoute: true,
            generateController: true,
            generateModel: true,
            generateMigration: false, // Doesn't matter, it will be generated either way
            generateUI: true,
            relations: [],
            operations: {
              index: true,
              create: true,
              store: true,
              show: true,
              edit: true,
              update: true,
              destroy: true,
              storeMany: true,
              destroyMany: true,
            },
            indexColumns: ["Name", "Email"],
            customOperations: [],
            name: "User",
            timestamps: true,
            columns: [],
          },
        },
        tenantSettings: {
          user: 1,
          tenant: 0,
          table: null,
        },
        rbac: {
          enabled: false,
          multipleRoles: false,
          roles: [
            {
              name: "Admin",
              description: "User with full access to everything",
              default: false,
            },
          ], // When admin can't create roles, they are hardcoded
          permissions: [], // List of all permissions
          matrix: [
            {
              role: "Admin",
              permissions: [],
            },
          ],
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
        // Pre process input
        // Deep copy input
        const input = JSON.parse(JSON.stringify(this.projectInput));
        await this.storeAction(input);
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
        name: "NewTable",
        timestamps: true,
        generateRoute: true,
        generateModel: true,
        generateUI: true,
        generateController: true,
        generateMigration: true,
        singleton: false,
        parent: null,
        routeParents: [],
        indexColumns: [],
        operations: {
          index: true,
          create: true,
          store: true,
          show: true,
          edit: true,
          update: true,
          destroy: true,
          storeMany: true,
          destroyMany: true,
        },
        customOperations: [], // custom operations are based on resource, eg: ticket can have resolve operation.
        columns: [],
        relations: [],
      });
    },

    removeTable(index) {
      this.projectInput.tables.splice(index, 1);
    },

    removeRole(index) {
      this.projectInput.rbac.roles.splice(index, 1);
    },

    removeRelation(table, relationIndex) {
      table.relations.splice(relationIndex, 1);
    },

    removeCustomOperation(table, customOperationIndex) {
      table.customOperations.splice(customOperationIndex, 1);
    },

    removeColumn(table, columnIndex) {
      table.columns.splice(columnIndex, 1);
    },

    addColumn(table) {
      table.columns.push({
        meta: {
          required: false,
          expose: true,
          filterable: false,
          trim: false,
        },
        input: {
          type: "Input",
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

    addCustomOperation(table) {
      table.customOperations.push({
        name: "",
        method: "GET",
        singular: false,
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
        withModel: null,
        name: "",
        required: true, // Only applicable to belongsTo
      });
    },

    /**
     * Returns a list of belongs to relations excluding tenant and auth
     */
    getBelongsToList(table) {
      return table.relations.filter(
        (relation) =>
          relation.type === "BelongsTo" && !relation.withModel?.startsWith("$")
      );
    },
    getBelongsToListFull(table) {
      return table.relations.filter(
        (relation) => relation.type === "BelongsTo"
      );
    },

    getColumnsForTable(table) {
      return table.columns.map((column) => column.name);
    },

    /**
     * Toggle a permission in matrix
     */
    togglePermission(role, permission) {
      if (role.permissions.includes(permission.name)) {
        role.permissions.splice(role.permissions.indexOf(permission.name), 1);
      } else {
        role.permissions.push(permission.name);
      }
    },

    /**
     * Checks if a permission exits in matrix for a role name
     */
    hasPermission(role, permission) {
      return role.permissions.includes(permission.name);
    },

    addRole() {
      this.projectInput.rbac.roles.push({
        name: "",
        description: "",
      });
    },

    grantAllPermissionToRole(role) {
      while (role.permissions.length > 0) {
        role.permissions.pop();
      }
      this.projectInput.rbac.permissions.map((permission) => {
        if (!role.permissions.includes(permission.name))
          role.permissions.push(permission.name);
      });
    },

    generatePermissionsAndMatrix() {
      const permissions = [];
      const operations = [
        "index",
        "create",
        "store",
        "show",
        "edit",
        "update",
        "destroy",
        "storeMany",
        "destroyMany",
      ];
      const roleModelPermissions = [];
      const permissionModelPermissions = [];
      const authModelPermissions = [];

      operations.map((operation) => {
        roleModelPermissions.push({
          name: `Role:${operation}`,
          description: "",
        });
        permissionModelPermissions.push({
          name: `Permission:${operation}`,
          description: "",
        });
        authModelPermissions.push({
          name: `${this.projectInput.auth.table.name}:${operation}`,
          description: "",
        });
      });
      permissions.push(
        ...roleModelPermissions,
        ...permissionModelPermissions,
        ...authModelPermissions
      );
      this.projectInput.tables.forEach((table) => {
        const operations = table.operations;
        if (operations.index) {
          permissions.push({
            name: `${table.name}:index`,
            description: "",
          });
        }
        if (operations.create) {
          permissions.push({
            name: `${table.name}:create`,
            description: "",
          });
        }
        if (operations.store) {
          permissions.push({
            name: `${table.name}:store`,
            description: "",
          });
        }
        if (operations.show) {
          permissions.push({
            name: `${table.name}:show`,
            description: "",
          });
        }
        if (operations.edit) {
          permissions.push({
            name: `${table.name}:edit`,
            description: "",
          });
        }
        if (operations.update) {
          permissions.push({
            name: `${table.name}:update`,
            description: "",
          });
        }
        if (operations.destroy) {
          permissions.push({
            name: `${table.name}:destroy`,
            description: "",
          });
        }
        if (operations.storeMany) {
          permissions.push({
            name: `${table.name}:storeMany`,
            description: "",
          });
        }
        if (operations.destroyMany) {
          permissions.push({
            name: `${table.name}:destroyMany`,
            description: "",
          });
        }
        if (
          Array.isArray(table.customOperations) &&
          table.customOperations.length
        ) {
          table.customOperations.map((customOperation) => {
            permissions.push({
              name: `${table.name}:${customOperation.name}`,
            });
          });
        }
      });
      this.projectInput.rbac.permissions = permissions;
      // Empty matrix array
      while (this.projectInput.rbac.matrix.length) {
        this.projectInput.rbac.matrix.pop();
      }
      this.projectInput.rbac.roles.forEach((role) =>
        this.projectInput.rbac.matrix.push({
          role: role.name,
          permissions: [],
        })
      );
    },
  },

  computed: {
    filteredTypes() {
      return [PROJECT_TYPE.API, PROJECT_TYPE.SSR];
    },
    ...mapState("auth", {
      user: (state) => state.user,
    }),
    ...mapState("project", {
      items: (state) => state.items,
      meta: (state) => state.meta,
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
