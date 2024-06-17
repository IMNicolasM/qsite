import { i18n } from "src/plugins/utils"

const status = () => ({
    1: {
        label: i18n.tr('isite.cms.label.pending'),
        icon: {
            name: 'fa-solid fa-clock',
            color: 'tw-text-orange-400'
        },
    },
    2: {
        label: i18n.tr('isite.cms.message.inProgress'),
        icon: {
            name: 'fa-duotone fa-spinner-third fa-spin',
            color: 'tw-text-blue-400'
        }
    },
    3: {
        label: i18n.tr('isite.cms.message.failed'),
        icon: {
            name: 'fa-solid fa-circle-exclamation',
            color: 'tw-text-red-400'
        }
    },
    4: {
        label: i18n.tr('isite.cms.label.success'),
        icon: {
            name: 'fa-solid fa-circle-check',
            color: 'tw-text-green-400'
        }
    }
})

export const constants = () => ({
    status: {
        ...status()
    },
    columns: [
        { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        { 
            name: 'action', 
            label: i18n.tr('isite.cms.label.action'), 
            align: 'left', 
            field: 'action', 
            sortable: true, 
        },
        { 
            name: 'createdAt', 
            label: i18n.tr('isite.cms.label.date'), 
            align: 'left', 
            field: 'createdAt', 
            sortable: true 
        },
        { 
            name: 'statusId', 
            label: i18n.trp('isite.cms.label.state'), 
            align: 'left', 
            field: 'statusId', 
            sortable: true,
            format: (val) => status()[val].label,
            style: 'width: 64px'
        },
        { 
            name: 'icon', 
            label: '', 
            align: 'center', 
            field: 'statusId',
            format: (val) => status()[val].icon,
            style: 'padding-left: 0; width: 20px' 
        },
    ],
    initialPagination: {
        sortBy: 'id',
        descending: true,
        rowsPerPage: 10
    },
    typesOfMessages: {
        info: {
            icon: 'fa-solid fa-circle-info',
            color: 'info'
        },
        warning: {
            icon: 'fa-solid fa-triangle-exclamation',
            color: 'warning'
        },
    },
    fieldMassiveActions: {
        name: 'actionType',
        value: '',
        type: 'select',
        required: true,
        props: {
            label: i18n.tr('isite.cms.label.action'),
            options: [],
            emitValue: false,
            'map-options': false,
        }
    }
})
