<template>
    <master-modal 
        v-model="showModal" 
        icon="fa-solid fa-boxes-packing"
        width="380px" 
        :loading="loading"
        :title="modalTitle" 
        @hide="reset()" 
        @show="init()" 
        custom-position
    >
        <div v-if="!loading">
            <!--Generate new report-->
            <div class="col-12">
                <!--Title-->
                <span class="text-blue-grey">
                    <b>{{ i18n.tr('isite.cms.label.newBulkAction') }}</b>
                </span>
                <h4
                    class="tw-mb-2 tw-mt-3.5 tw-text-sm"
                    v-html="i18n.tr('isite.cms.messages.dispatchBulkAction', { pageTitle })"
                />
                <!--Actions-->
                <div class="text-right">
                    <actionsForm 
                        :field="field"
                        :optionsForBulkActions="optionsForBulkActions"
                        :thereAreMessages="thereAreMessages"
                        :processing="processing"
                        @newReport="newReport"
                        @update:selectedAction="handleChangeBulkActions"
                        @update:selectedOption="updateOptionsBulkActions"
                    />
                </div>
            </div>

            <section v-if="thereAreMessages" class="tw-w-full tw-mt-4">
                <!-- Warnings -->
                <div
                    class="
                        tw-max-h-64
                        tw-overflow-auto
                        tw-mb-3.5
                    "
                >
                    <div class="tw-gap-3 tw-flex tw-flex-col">
                        <!-- Alert -->
                        <warning :messages="messages"/>
                    </div>
                </div>
                    
                <div class="tw-w-full tw-flex tw-justify-end">
                    <q-btn
                        :label="i18n.tr('isite.cms.label.confirm')"
                        color="secondary" 
                        rounded 
                        unelevated 
                        size="13px"
                        class="tw-mr-3.5"
                        :loading="processing"
                        :disable="processing"
                        @click="newReport(true)"
                    />

                    <q-btn 
                        :label="i18n.tr('isite.cms.label.cancel')"
                        rounded 
                        unelevated
                        size="13px"
                        class="tw-bg-gray-200 tw-text-gray-700"
                        @click="messages = []"
                    >
                        <template v-slot:loading>
                            <i class="fa-solid fa-spinner-third fa-spin"></i>
                        </template>
                    </q-btn>
                </div>
            </section>

            <section class="tw-w-full tw-mt-5">
                <h4 class="tw-font-bold tw-text-sm text-blue-grey tw-mb-3.5">
                    {{ i18n.tr('isite.cms.label.history') }}
                </h4>
                <logTable
                    :rows="log"
                    :columns="columns"
                    :pagination="initialPagination"
                />
            </section>
        </div>
    </master-modal>
  </template>
<script lang="ts">
import { bulkActionsController } from './bulkActions.controller'
import actionsForm from './components/actionsForm.vue'
import logTable from './components/logTable.vue'
import warning from './components/warning.vue'

export default {
    emits: ['bulkActionsConfig'],
    props: {
        dynamicFilterValues: {
            required: false,
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    components: {
        logTable,
        warning,
        actionsForm
    },
    setup(props, { expose, emit }) {
        return { ...bulkActionsController(props, { expose, emit }) }
    }
}
</script>