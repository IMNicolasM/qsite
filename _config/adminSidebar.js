const pages = config('pages') // Get Pages from config

//Places
export default [
  {
    title: 'isite.cms.sidebar.adminGroup',
    icon: 'fal fa-chess-rook',
    children: [
      pages.qsite.categories,//organization categories
      pages.qsite.icruds,//Cruds
      pages.qsite.layouts
    ]
  },
  pages.qsite.organizationsAll,//organizations
  pages.qsite.organizations,//organizations
  pages.qsite.index,//setup
  pages.qsite.auditLog,
]
