//Layout container
import master from 'src/layouts/master'


//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  //Home Page
  index: {
    permission: null,
    activated: true,
    path: '/site/index',
    name: 'app.site.index',
    layout: require('@imagina/qsite/_layouts/index').default,
    containerLayout: master,
    title: 'Site',
    icon: 'fas fa-list-alt',
    //middleware: [auth]
  },
}