<template>
  <div id="masterDrawers1">
    <!-- MENU -->
    <q-drawer id="menuMaster" class="no-shadow" v-model="drawer.menu" ref="menuMaster"
              @click.capture="miniState ? $eventBus.$emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div id="logoSite" class="relative-position">
        <q-img contain :src="logo" style="height: 80px; min-height: 80px"/>
        <!--Version-->
        <div id="versionContent" class="absolute absolute-bottom-right text-white">
          <q-icon name="fas fa-code-branch" class="q-mr-xs"/>
          {{ versionText }}
        </div>
      </div>
      <!--List iadmin-->
      <q-scroll-area id="adminMenu" :style="`height: calc(100vh - 146px`">
        <!--Menu-->
        <menu-list ref="menuList" group :translatable="menuTranslatable" :menu="menuSelect"/>
      </q-scroll-area>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" overlay v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>

    <!-- Chat -->
    <q-drawer bordered id="chatMaster" overlay v-model="drawer.chat" side="right"
              v-if="$auth.hasAccess('ichat.conversations.index')">
      <chat-list/>
    </q-drawer>


    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right" behavior="mobile"
              :overlay="true"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>

    <!--Notification-->
    <q-dialog v-model="drawer.notification" posititon="right" transition-hide="slide-up" transition-show="slide-down">
      <master-notifications
        v-show="drawer.notification"
        v-if="$auth.hasAccess('notification.notifications.manage')"
        :isMobile="this.windowSize == 'mobile' ? true : false"
      />  
    </q-dialog>
  </div>
</template>
<script>
//mixins
import sidebarMixins from '@imagina/qsite/_mixins/sidebarMixins'
//Components
import configList from '@imagina/qsite/_components/master/configList'
import chatList from '@imagina/qchat/_components/drawerChatList'
import menuList from '@imagina/qsite/_components/master/recursiveItem'
import checkin from '@imagina/qcheckin/_components/checkin'
import masterRecommendation from '@imagina/qsite/_components/master/masterRecommendations'
import masterNotifications from '@imagina/qnotification/_components/drawerNotifications'

export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleMasterDrawer')
    this.$eventBus.$off('openMasterDrawer')
  },
  mixins: [sidebarMixins],
  props: {},
  components: {menuList, configList, chatList, checkin, masterRecommendation, masterNotifications},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWith: window.innerWidth,
      projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
      miniState: this.windowSize == 'mobile' ? false : true,
      drawer: {
        menu: this.$q.platform.is.mobile ? false : true,
        config: false,
        chat: false,
        checkin: false,
        recommendation: false,
        notification: false
      },
      appConfig: config('app')
    }
  },
  computed: {
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
    routeSubHeader() {
      this.drawer.recommendation = false
      return this.$route.meta.subHeader || {}
    },
    //Version app text
    versionText() {
      return 'v' + config('app.version')
    },
    logo() {
      return this.$store.state.qsiteApp.logo;
    },
  },
  methods: {
    //init
    init() {
      this.handlerEvent()
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.windowWith = window.innerWidth
      })
    },
    handlerEvent() {
      //handler toggleMasterDrawer
      this.$eventBus.$on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //handler openMasterDrawer
      this.$eventBus.$on('openMasterDrawer', (drawerName) => this.drawer[drawerName] = true)
    },
    //Show drawer specific
    toggleDrawer(drawerName) {
      //Hidden all drawers
      for (var drawer in this.drawer) {
        if (drawer != drawerName) {
          if ((drawer == 'menu') && (this.windowSize != 'mobile')) {
            this.miniState = true
          } else {
            this.drawer[drawer] = false
          }
        }
      }
      //Toogle drawer
      if (drawerName == 'menu') {
        if (this.windowSize == 'mobile') {
          this.miniState = false
          this.drawer.menu = !this.drawer.menu
        } else {
          this.drawer.menu = true
          this.miniState = !this.miniState
        }
      } else {
        this.drawer[drawerName] = !this.drawer[drawerName]
      }
    }
  }
}
</script>
<style lang="stylus">

#masterDrawers1
  background-color $custom-accent-color !important

  #drawerRecomendationMaster
    .q-drawer
      max-height max-content

    .q-drawer__content
      background $custom-accent-color

  #menuMaster
    aside
      background $primary
      background-color $custom-accent-color !important

    #logoSite
      padding 20px 25px 26px 25px
      height 120px
      background-color $primary

    #versionContent
      padding 3px 15px
      font-size 13px

    .q-expansion-item
      background-color $custom-accent-color !important

    .q-expansion-item__container
      .q-expansion-item__content
        padding 0 0 0 2px
        border-left 15px solid $custom-accent-color

    .q-item
      padding-left 0
      min-height 40px
      color $blue-grey

      .q-item__section--avatar
        padding 0 18px !important

        .q-icon
          font-size 20px
          color $blue-grey

      &:hover
        background-color $grey-4
        color $primary

        .q-icon
          color $primary
          font-size 22px

      &.item-is-active
        background-color $custom-accent-color

        .q-item__section, .q-icon
          color $primary

    .expansion-selected
      background-color $primary

</style>
