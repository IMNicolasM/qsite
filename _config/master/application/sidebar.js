import appConfig from 'src/config/app'
import pagesConfig from 'src/config/pages'

class AutoLoadSidebar {
  constructor() {
    this.sidebar = {}
    this.modules = appConfig.modules
    this.pages = pagesConfig
    this.addDefaultItems()
    //Load iadmin sidebar
    if (appConfig.mode == 'iadmin') {
      this.loadModulesSidebar({name: 'adminSidebar'})
      this.loadPerzonalizationSidebar()
    }
    //Load ipanel sidebar
    if (appConfig.mode == 'ipanel') this.loadModulesSidebar({name: 'panelSidebar'})
    //order sidebar
    this.orderSidebar()
  }

  //Add extra fields to sidebar
  addDefaultItems() {
    if (this.pages.mainqsite)
      this.sidebar['app'] = this.pages.mainqsite.home || {}
  }

  //Load node_modules sidebar
  loadModulesSidebar(params = {}) {
    this.modules.forEach((name) => {
      let sidebarNode = false
      //Search module in node_modules
      try {
        sidebarNode = require(`@imagina/${name}/_config/${params.name}`).default
      } catch (e) {
      }

      //Search module in project
      try {
        sidebarNode = require(`src/modules/${name}/_config/${params.name}`).default
      } catch (e) {
      }

      if (sidebarNode && sidebarNode.length) {
        sidebarNode.forEach((node, index) => {
          this.sidebar[`${name}${index ? (index + 1) : ''}`] = node
        })
      }
    })
  }

  //Order sidebar
  orderSidebar() {
    //instance counters
    let multipleSidebar = {}
    let singleSidebar = {}

    //Group sidebar by type
    Object.keys(this.sidebar).forEach(name => {
      let sidebar = this.sidebar[name]
      if ((sidebar.name == 'app.home') || sidebar.children) multipleSidebar[name] = sidebar
      else singleSidebar[name] = sidebar
    })

    //Assign response
    this.sidebar = {...multipleSidebar, ...singleSidebar}
  }

  //Add perzonalization/settings page
  loadPerzonalizationSidebar() {
    this.modules.forEach(moduleName => {
      if (pagesConfig[moduleName].personalization) {
        if (this.sidebar[moduleName].children) {
          this.sidebar[moduleName].children.push(pagesConfig[moduleName].personalization)
        }
      }
    })
  }
}


//Create Class
const autoLoadSidebar = new AutoLoadSidebar()
const customSidebar = autoLoadSidebar.sidebar

//Custom export
export {customSidebar}

//Default export
export default Object.values(autoLoadSidebar.sidebar)
