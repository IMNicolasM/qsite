<template>
  <div id="configList" class="q-pa-md">
    <!-- ===== Header ===== -->
    <div class="row justify-between items-center">
      <div class="text-subtitle1 row items-center">
        <q-icon name="fas fa-cog" color="primary" size="20px" class="q-mr-sm" />
        <label>{{ $tr('isite.cms.label.configuration', { capitalize: true }) }}</label>
      </div>
      <!-- Close icon -->
      <q-icon name="fas fa-times" color="blue-grey" size="20px" class="cursor-pointer"
              @click="eventBus.emit('toggleMasterDrawer', 'config')" />
    </div>

    <!--Separator-->
    <q-separator class="q-my-md" />

    <!--Impersonate-->
    <q-no-ssr>
      <div v-if="$hasAccess('profile.user.impersonate') || quserState.impersonating">
        <!--Title-->
        <div class="title-block q-mb-sm">
          {{ $tr('isite.cms.label.impersonate') }}
        </div>

        <!--Select User to impersonate-->
        <div class="q-py-none" v-if="!quserState.impersonating">
          <div class="full-width text-primary">
            <!--Select-->
            <div class="q-mt-xs" v-if="!loadingImpersonate">
              <q-select outlined dense v-model="userToImpersonate" use-input hide-selected
                        emit-value map-options
                        input-debounce="800" :options="userList" @filter="getUsers"
                        :placeholder="`${$tr('isite.cms.label.find')} ${$tr('isite.cms.label.user')}...`"
                        @update:modelValue="impersonate()" style="width: 100%">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $tr('isite.cms.message.searchNotFound') }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <!--Loading-->
            <div v-else class="q-py-sm row items-center">
              <q-spinner class="q-mr-sm" />
              {{ `${$tr('isite.cms.label.loading')}...` }}
            </div>
          </div>
        </div>

        <!--Leave impersonating-->
        <q-item tag="label" link v-else @click.native="impersonate">
          <q-item-section>
            <div class="row items-center">
              <!--Loading-->
              <div v-if="loadingImpersonate" class="q-py-sm row items-center">
                <q-spinner class="q-mr-sm" />
                {{ `${$tr('isite.cms.label.loading')}...` }}
              </div>
              <div v-else color="grey-10" style="text-decoration: none">
                <q-icon color="red" class="q-mr-sm" name="fas fa-sign-out-alt"
                        size="20px" />
                {{ $t('isite.cms.configList.leaveImpersonating', { capitalize: true }) }}
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>
    </q-no-ssr>

    <!--Separator-->
    <q-separator class="q-my-md" v-if="$hasAccess('profile.user.impersonate') || quserState.impersonating" />

    <!--user Data-->
    <q-no-ssr>
      <!--Title-->
      <div class="title-block">
        {{ $tr('isite.cms.label.session', { capitalize: true }) }}
      </div>

      <!--Roles-->
      <div class="q-mt-xs q-px-sm">
        <!-- Title -->
        <div class="text-primary">
          <q-icon name="fas fa-user-circle" />
          {{ $trp('isite.cms.label.role') }}
        </div>

        <!--Roles-->
        <label class="block text-grey-8" style="line-height: 1.4">
          {{
            quserState.userData.roles.map(role => {
              return role.name
            }).join(', ')
          }}
        </label>
      </div>

      <!--Department-->
      <div class="q-mt-xs q-px-sm">
        <!-- Title -->
        <div class="text-primary">
          <q-icon name="fas fa-people-arrows" />
          {{ this.$trp('iprofile.cms.label.userGroup') }}
        </div>

        <!--Departments-->
        <label class="block text-grey-8" style="line-height: 1.4">
          {{
            quserState.userData.departments.map(department => {
              return department.title
            }).join(', ')
          }}
        </label>
      </div>
    </q-no-ssr>

    <!--Separator-->
    <q-separator class="q-my-md" v-if="$hasAccess('profile.user.impersonate') || quserState.impersonating" />

    <!--Organization-->
    <q-no-ssr v-if="organizationField">
      <!--Title-->
      <div class="title-block q-mb-sm">
        {{ $tr('isite.cms.label.organization') }}
      </div>
      <!--dynamic field to organizations-->
      <dynamic-field v-model="organizationId" :field="organizationField" v-if="organizationField"
                     @update:modelValue="setOrganization" />
      <!--no organizations-->
      <div v-else class="q-px-sm text-grey-7" style="line-height: 1.2">
        {{ $tr('isite.cms.messages.noOrganization') }}...
      </div>
    </q-no-ssr>

    <!--Separator-->
    <q-separator class="q-my-md" />

    <!-- Language -->
    <div>
      <!--Title-->
      <div class="title-block">
        {{ $tr('isite.cms.label.language', { capitalize: true }) }}
      </div>

      <!--Data language-->
      <div class="q-mt-xs q-px-sm">
        <!-- Title -->
        <div class="text-primary">
          <q-icon name="fas fa-language" />
          {{ $tr('isite.cms.label.language', { capitalize: true }) }}
        </div>

        <!--Select Language-->
        <q-select :options="options.locales" dense outlined emit-value map-options
                  filter hide-underline v-if="show.locales" @update:modelValue="updateLocale"
                  v-model="locale" class="full-width q-if-focused q-if-focusable" />

        <!--Current language selected-->
        <label v-else class="block ellipsis">
          {{ options.locales[0].label }}
        </label>
      </div>
    </div>

    <!--Separator-->
    <q-separator class="q-my-md" />

    <!-- ===== Custom Configs ===== -->
    <div v-for="customConfig in customConfigs">
      <div class="title-block">
        {{ $trp(customConfig.moduleTitle, { capitalize: true }) }}
      </div>
      <div v-for="config in customConfig.configList" class="q-px-sm cursor-pointer q-pt-md" @click="config.action()">
        <q-icon color="primary" size="18px" :name="config.icon" class="q-mr-sm" />
        {{ $t(config.title, { capitalize: true }) }}
      </div>
    </div>

    <!--Separator-->
    <q-separator class="q-my-md" />

    <!-- ===== Settings ===== -->
    <div>
      <!--Title-->
      <div class="title-block">
        {{ $trp('isite.cms.label.action', { capitalize: true }) }}
      </div>

      <!--Clear Cache-->
      <div
        v-if="!isAppOffline"
        class="q-px-sm cursor-pointer q-pt-md"
        @click="$router.push({
          name: 'app.update.app',
          query: { fromCache: 1 }
        })"
      >
        <q-icon color="primary" size="18px" name="fas fa-broom" class="q-mr-sm" />
        {{ $t('isite.cms.configList.clearCache', { capitalize: true }) }}
      </div>

      <!--Full Screen-->
      <div class="q-px-sm cursor-pointer q-pt-md" @click="toggleFullscreen()">
        <q-icon color="primary" size="18px" name="fas fa-expand" class="q-mr-sm" />
        {{ $t('isite.cms.configList.fullScreen', { capitalize: true }) }}
      </div>

      <!--Logout  -->
      <q-no-ssr v-if="!isAppOffline">
        <div class="q-px-sm cursor-pointer q-pt-md" @click="$router.push({name:'auth.logout'})"
             v-if="quserState.authenticated">
          <q-icon color="red" size="18px" name="fas fa-sign-out-alt" class="q-mr-sm" />
          {{ $t('isite.cms.configList.signOut', { capitalize: true }) }}
        </div>
      </q-no-ssr>
    </div>

    <div class="text-subtitle2 fixed fixed-bottom text-blue-grey q-px-md q-py-sm text-right">
      <q-icon name="fas fa-code-branch" class="q-mr-xs" />
      {{ versionText }}
    </div>
  </div>
</template>
<script>
import { eventBus } from 'src/plugins/utils'
export default {
  mounted() {
    this.$nextTick(async function() {
      this.setOptions()
    })
  },
  data() {
    return {
      valueConsistsOf: 'BRANCH_PRIORITY',
      organizationId: this.$clone(this.$store.state.quserAuth.organizationId),
      roleId: false,
      departmentId: false,
      locale: this.$store.state.qsiteApp.defaultLocale,
      options: {
        roles: this.$store.getters['quserAuth/userRolesSelect'],
        departments: this.$store.getters['quserAuth/userDepartmentsSelect'],
        locales: this.$store.getters['qsiteApp/getSelectedLocalesSelect']
      },
      show: {
        roles: false,
        departments: false,
        locales: false
      },
      fullScreen: this.$q?.fullscreen?.isActive,
      userToImpersonate: null,
      loadingImpersonate: false,
      userList: [],
      loadingCacheClear: false,
      eventBus
    }
  },
  computed: {
    isAppOffline() {
      return this.$store.state.qofflineMaster.isAppOffline;
    },
    customConfigs() {
      const getCustomConfigs = Object.values(config('main')).map(item => {
        if (item.configList) {
          return {
            moduleTitle: item.moduleTitle,
            configList: item.configList
          }
        }
        return {
          moduleTitle: item.moduleTitle,
          configList: []
        }
      });

      return getCustomConfigs.filter(config => config.configList.length > 0)
    },
    versionText() {
      return 'v' + config('app.version')
    },
    quserState() {
      return this.$store.state.quserAuth
    },
    forceRoleAndDepartment() {
      return config('app.forceRoleAndDepartment')
    },
    //return organization field
    organizationField() {
      //get organizations
      let organizations = this.$store.state.quserAuth.organizations || []

      //validate organizations
      if (!organizations.length) return false

      //return field
      return {
        value: null,
        type: 'select',
        props: {
          label: this.$tr('isite.cms.label.organization'),
          options: organizations.map(item => {
            return {label: item.title, value: item.id}
          }),
          readonly: organizations.length == 1 ? true : false
        }
      }
    }
  },
  methods: {
    //Toggle fullscreen
    toggleFullscreen() {
      this.$q?.fullscreen?.toggle()
    },

    //Set departments and roles to options
    async setOptions() {
      let roleUser = await this.$cache.get.item('auth.role.id')//Get role form storage
      let departmentUser = await this.$cache.get.item('auth.department.id')//Get department form storage

      this.roleId = roleUser
      this.departmentId = departmentUser

      //Check if exist more then one role and department
      if (this.options.roles.length >= 2) {
        this.show.roles = true
      }
      if (this.options.departments.length >= 2) {
        this.show.departments = true
      }
      if (this.options.departments.length == 1) {
        if (this.options.departments[0].children) {
          this.show.departments = true
        }
      }
      if (this.options.locales.length >= 2) {
        this.show.locales = true
      }
    },

    //Update department and role id
    async updateDepRolUser(reset = false) {
      if (this.forceRoleAndDepartment) {
        const departmentId = await this.$cache.get.item('auth.department.id')//Get department selected
        const roleId = await this.$cache.get.item('auth.role.id')//Get role selected

        //Check that role or department selected are distinct to atorage
        if ((departmentId != this.departmentId) || (roleId != this.roleId)) {
          await this.$cache.set('auth.department.id', this.departmentId)
          await this.$cache.set('auth.role.id', this.roleId)
          this.$store.dispatch('qsiteApp/REFRESH_PAGE')
        }
      }
    },

    //update Locale
    async updateLocale() {
      this.$store.dispatch('qsiteApp/SET_LOCALE', { locale: this.locale, vue: this }).then(response => {
        this.$store.dispatch('qsiteApp/REFRESH_PAGE')
      }).catch(error => console.error(error))
    },

    //Get users to impersonate
    getUsers(val, update, abort) {
      //Validate length of val
      if (val.length < 2) return abort()

      let params = {params: {take: 100, filter: {search: val}}}
      //Request
      this.$crud.index('apiRoutes.quser.users', params).then(response => {
        update(() => {
          let userId = this.$store.state.quserAuth.userId
          let options = []
          response.data.forEach(item => {
            if (item.id != userId) options.push({label: item.fullName, value: item.id})
          })
          this.userList = this.$clone(options)
        })
      }).catch(error => {
        this.$apiResponse.handleError(error, () => {
          update(() => {
            this.userList = []
          })
        })
      })
    },

    //toggle impersonate
    async impersonate() {
      this.loadingImpersonate = true

      if (this.quserState.impersonating) {
        await this.$store.dispatch('quserAuth/USER_LEAVE_IMPERSONATE')
      } else if (this.userToImpersonate) {
        await this.$store.dispatch('quserAuth/USER_IMPERSONATE', this.userToImpersonate)
      }

      this.loadingImpersonate = false
      if (this.$route.name != 'app.home') this.$router.push({ name: 'app.home' });
      setTimeout(() => window.location.reload(), 200)
    },

    //set organization
    async setOrganization(organizationId) {
      await this.$store.dispatch('quserAuth/SET_ORGANIZATION', {organizationId})
      this.$store.dispatch('qsiteApp/REFRESH_PAGE')
    }
  }
}
</script>
<style lang="scss">
#configList {
  color: $grey-9;

  .q-icon {
    min-width: max-content !important;
  }

  .title-block {
    border-radius: 5px;
    background-color: $primary;
    color: white;
    padding: 4px 15px;
  }
}
</style>
