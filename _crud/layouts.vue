<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        apiRoute: 'apiRoutes.qsite.layouts',
        permission: 'isite.layouts',
        extraFormFields: 'isite.crud-fields.layouts',
        create: {
          title: this.$tr('isite.cms.newLayout'),
        },
        read: {
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'),
              field: 'id',
              sortable: true,
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.title'),
              field: 'title',
              align: 'left',
              sortable: true,
            },
            {
              name: 'systemName', label: this.$tr('isite.cms.form.systemName'),
              field: 'systemName',
              align: 'left',
            },
            {
              name: 'status', label: this.$tr('isite.cms.form.status'),
              align: 'left', field: 'status'
            },
            {
              name: 'moduleName', label: this.$tr('isite.cms.label.module'),
              align: 'left', field: 'moduleName'
            },
            {
              name: 'entityName', label: this.$tr('isite.cms.label.entity'),
              align: 'left', field: 'entityName'
            },
            {
              name: 'entityType', label: this.$tr('isite.cms.form.type'),
              align: 'left', field: 'entityType'
            },
            {
              name: 'path', label: this.$tr('isite.cms.form.path'),
              align: 'left', field: 'path'
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt',
              format: val => val ? this.$trd(val) : '-',
              align: 'left', sortable: true
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'center'
            },
          ],
          requestParams: {}
        },
        update: {
          title: this.$tr('isite.cms.updateLayout')
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          title: {
            value: '',
            type: 'input',
            isTranslatable: true,
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          systemName: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.systemName')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              options: [
                {label: this.$tr('isite.cms.label.enabled'), value: '1'},
                {label: this.$tr('isite.cms.label.disabled'), value: '0'}
              ]
            },
          },
          moduleName: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.label.module')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          entityName: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.label.entity')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          entityType: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.type')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          path: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.label.path')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          mediasSingle: {
            name: 'mediasSingle',
            value: {},
            type: 'media',
            props: {
              label: this.$tr('isite.cms.form.firstImage'),
              zone: 'mainimage',
              entity: "Modules\\Isite\\Entities\\Layout",
              entityId: null
            }
          }
        },
        formRight: {},
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
