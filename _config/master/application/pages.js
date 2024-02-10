import appConfig from 'src/config/app'
import mainConfigs from 'modules/qsite/_config/master/application/main'

class AutoLoadPages {
  constructor() {
    this.pages = {}
    this.modules = appConfig.modules
    this.updatePages = []
    //Load main pages
    this.loadPages({prefix: 'main', name: 'mainPages'})
    //Load iadmin pages
    if (appConfig.mode == 'iadmin') {
      this.loadPages({name: 'adminPages'})
      this.loadPerzonalizationPage()
    }
    //Load ipanel pages
    if (appConfig.mode == 'ipanel') this.loadPages({name: 'panelPages'})
    //Update pages
    this.loadUpdatePages()
  }

  //Load modules backend page
  loadPages(params = {}) {
    this.modules.forEach(moduleName => {
      let configPage = false
      let namePage = `${params.prefix || ''}${moduleName}`

      //Search module in node_modules
      try {
        configPage = require(`modules/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      //Search module in project (src)
      try {
        configPage = require(`src/modules/${moduleName}/_config/${params.name}`)
      } catch (e) {
      }

      //Add pages
      this.pages[namePage] = configPage ? configPage.default : {}
      //Add method to updated pages
      if (configPage.updatePages) this.updatePages.push(configPage.updatePages)
    })
  }

  //Load changes in pages
  loadUpdatePages() {
    this.updatePages.forEach(updatedPages => {
      this.pages = updatedPages(this.pages)
    })
  }

  //Add perzonalization/settings page
  loadPerzonalizationPage() {
    this.modules.forEach(moduleName => {
      let moduleMainConfig = mainConfigs[moduleName] || {}
      if (moduleMainConfig.perzonalizationPage) {
        this.pages[moduleName].personalization = {
          permission: 'isite.settings.manage',
          activated: true,
          path: `/${moduleMainConfig.moduleName}/personalization`,
          name: `${moduleName}.admin.personalization`,
          page: () => import('modules/qsite/_pages/admin/settings/settingsByModule'),
          layout: () => import('layouts/master.vue'),
          title: 'isite.cms.label.personalization',
          icon: 'fas fa-brush',
          authenticated: true,
          subHeader: {refresh: true},
          mainConfig: moduleMainConfig
        }
      }
    })
  }
}

//Create new class
const autoLoadPages = new AutoLoadPages()

//Response
export default autoLoadPages.pages
