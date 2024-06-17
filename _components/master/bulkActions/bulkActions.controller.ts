import { 
    ref,
    toRefs,
    onMounted, 
    nextTick, 
    computed,
} from 'vue'
import { useRoute } from 'vue-router'
import { BulkActions, Fields, SelectedAction, Message } from './models/interfaces'
import { constants } from './models/defaultModels/constants'
import { prepareMessageObject } from './helpers'
import { sendReport, getDataLog, getConfig } from './services'
import { helper, i18n, store, eventBus } from 'src/plugins/utils'

export const bulkActionsController = (props, { expose, emit }) => {
    const loading = ref(false)
    const processing = ref(false)
    const bulkActions = ref<SelectedAction[]>([])
    const paramsItem = ref({})
    const showModal = ref(false)
    const selectedAction = ref<SelectedAction | null>(null)
    const optionsForBulkActions = ref<Fields | undefined>({})
    const optionsForSelectedBulkActions = ref({})
    const messages = ref<Message[] | []>([])
    const log = ref([])
    const route = useRoute()

    const { dynamicFilterValues } = toRefs(props)

    const { module, entity } = helper.getInfoFromPermission(route.meta?.permission)
    const permission = `${module}.${entity}`

    const { 
        status, 
        columns, 
        initialPagination, 
        typesOfMessages,
        fieldMassiveActions
    } = constants()

    const filterAndSortBulkActions = (bulkActions: BulkActions[]) => {
        if (!bulkActions) return []
        return bulkActions
            .filter(option => (
                option?.permission 
                    ? store.hasAccess(option.permission) 
                    : true
            ))
            .map(option => ({
                label: option.title,
                value: option.name,
                apiRoute: option.apiRoute,
                fields: option?.fields,
            }))
    }

    //Get export config
    const getExportConfig = async () => {
        try {
            bulkActions.value = []
            const data = await getConfig(route, helper)
            emit('bulkActionsConfig', Boolean(data))
            bulkActions.value = filterAndSortBulkActions(data)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchDataLog = async () => {
        try {
            const data = await getDataLog(status, permission)
            log.value = data;
        } catch (error) {
            console.error(error);
        }
    }

    const init = async () => {
        loading.value = true;
        await getExportConfig();
        await fetchDataLog();
        loading.value = false;
    }

    const handleChangeBulkActions = (value: SelectedAction) => {
        selectedAction.value = value
        optionsForBulkActions.value = value?.fields
        messages.value = []
    }

    const updateOptionsBulkActions = ({ key, value }) => {
        optionsForSelectedBulkActions.value[key] = value;
    }

    const newReport = async (confirmed=false) => {
        processing.value = true;

        try {
            const response = await sendReport(
                confirmed, 
                selectedAction.value, 
                optionsForSelectedBulkActions.value,
                dynamicFilterValues.value,
                permission
            )

            const data = response?.data;
            if (data?.messages) {
                messages.value = prepareMessageObject(data.messages, typesOfMessages)
            }
            if (confirmed) {
                await fetchDataLog()
                messages.value = []
            }
        } finally {
            processing.value = false;
        }
    }

    eventBus.on('bulkActionRefresh', async (response) => {
        await fetchDataLog()
    })

    const showReport = () => {
        showModal.value = true;
    }

    const reset = () => {
        loading.value = false;
        messages.value = [];
        selectedAction.value = null;
        optionsForSelectedBulkActions.value = {};
        eventBus.off('bulkActionRefresh')
    }

    onMounted(() => {
        nextTick(async () => {
            await init()
        })
    })

    //Page title
    const pageTitle = computed(() => {
        const settingValueByName = store.getters['qsiteApp/getSettingValueByName']('isite::legacyStructureCMS') || 0
        const useLegacyStructure = parseInt(settingValueByName)

        return useLegacyStructure ? i18n.tr(route.meta.title) : route.meta.title
    })

    const thereAreMessages = computed(() => {
        return messages.value.length > 0
    })

    //Modal export title
    const modalTitle = computed(() => {
        return `Bulk Actions | ${pageTitle.value}`
    })

    const field = computed(() => {
        if (bulkActions.value.length === 0) return fieldMassiveActions

        return {
            ...fieldMassiveActions,
            props: {
                ...fieldMassiveActions.props,
                options: bulkActions.value,
            }
        }
    })

    expose({ showReport })

    return {
        loading,
        processing,
        thereAreMessages,
        messages,
        paramsItem,
        showModal,
        pageTitle,
        modalTitle,
        field,
        log,
        columns,
        initialPagination,
        selectedAction,
        optionsForBulkActions,
        optionsForSelectedBulkActions,
        i18n,
        init,
        newReport,
        showReport,
        reset,
        handleChangeBulkActions,
        updateOptionsBulkActions,
    }
}