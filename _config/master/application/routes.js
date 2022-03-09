import Route from 'vue-routisan'
import appConfig from 'src/config/app'

class AutoLoadRoutes {
  constructor() {
    this.pages = []
  }

  //get and format paths
  getRoutes(pages) {
    //get and format paths
    this.pages = this.setFormat(pages)
    //Load main routes
    this.loadRoutes()
    //load 404 page
    this.addExtraRoutes()
    //return all formatted paths
    return Route.all()
  }

  //Load main routes
  loadRoutes() {
    this.pages.forEach((page) => {
      if (page.activated) {
        //Create main route
        Route.view(page.path, page.layout).children(() => {
          Route.view('/', page.page).options(this.getOptionsPage(page));
        })
      }
    })
  }

  //format the paths
  setFormat(pages) {
    //Instance pages data
    const vuePages = []
    //Map pages
    pages.forEach(page => {
      //Get mode from system_name
      let pageMode = page.system_name.split('_')
      //Instance allowed modes
      let allowedModes = (appConfig.mode == 'iadmin') ? ['admin', 'main'] : ['panel', 'main']
      //Format pages
      if (allowedModes.includes(pageMode[2])) {
        //Require crud component
        const crudFile = page.options.crud ? this.requireVueFile(page.options.crud, 'crud') : null
        //Require page component
        const pageFile = this.requireVueFile(page.options.page, 'page')
        //Require layout component
        const layoutFile = this.requireVueFile(page.options.layout, 'layout')
        //Add page config if found the page and layout components
        if (pageFile && layoutFile) {
          vuePages.push({
            ...page.options, //Concat first all page options
            activated: parseInt(page.status) ? true : false,
            path: page.slug,
            crud: crudFile,
            page: pageFile,
            layout: layoutFile,
            title: page.title
          })
        }
      }
    })
    //Response mapped pages
    return vuePages
  }

  requireVueFile(path, type) {
    //Instance vueFile
    let vueFile = false
    //Parse file path
    let pathExplode = path.split('/')
    let packageName = pathExplode[0]
    let filePath = pathExplode.slice(2, pathExplode.length).join('/')
    if (!filePath.includes('.vue')) filePath += ".vue"
    //Try to get the vue file by type parameter page/layput/crud
    try {
      if (type == 'page') {
        vueFile = require(`@imagina/${packageName}/_pages/${filePath}`)
      } else if (type == 'layout') {
        vueFile = require(`@imagina/${packageName}/_layouts/${filePath}`)
      } else if (type == 'crud') {
        vueFile = import(`@imagina/${packageName}/_crud/${filePath}`)
      }
    } catch (e) {
    }
    //Return vueFile
    return vueFile ? vueFile.default ? vueFile.default : vueFile : false
  }

  //Return meta data to route
  getOptionsPage(page, locale = false) {
    let middlewares = (page.middleware || [])
    let routeName = locale ? `${locale}.${page.name}` : page.name
    return {
      name: routeName,
      meta: {
        ...page,
        permission: (page.permission ? page.permission : null),
        activated: page.activated,
        path: locale ? `${locale}.${page.path}` : page.path,
        name: routeName,
        title: page.title,
        headerTitle: page.headerTitle || false,
        icon: page.icon,
        authenticated: page.authenticated,
        subHeader: page.subHeader || {}
      },
      props: page.props || true,
      beforeEnter: middlewares,
    }
  }

  //Add extra routes
  addExtraRoutes() {
    //Add not found page
    if (process.env.MODE !== 'ssr') {
      Route.view('*', () => import('@imagina/qsite/_layouts/blank.vue')).children(() => {
        Route.view('/', () => import('@imagina/qsite/_pages/master/404')).options({
          name: 'app.not.found',
          meta: {
            permission: null,
            activated: true,
            path: '*',
            name: 'app.not.found',
            title: 'sidebar.pageNotFound',
            headerTitle: false,
            icon: 'fas fa-chart-bar',
            authenticated: false,
            subHeader: {}
          },
          props: true,
          beforeEnter: [],
        });
      })
    }
  }

}


//Create new clase
const routes = new AutoLoadRoutes()

//Response
export default routes
