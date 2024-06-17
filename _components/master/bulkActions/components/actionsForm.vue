<script setup lang="ts">
import { defineEmits, defineProps, ref, toRefs } from 'vue'
import { alert, i18n } from 'src/plugins/utils.ts'

const emit = defineEmits([
    'newReport', 
    'update:selectedAction', 
    'update:selectedOption'
])
defineProps({
    field: {
        required: true,
        type: Object
    },
    optionsForBulkActions: {
        required: false,
        type: Object,
        default: () => {
            return {}
        }
    },
    thereAreMessages: {
        required: false,
        type: Boolean,
        default: false
    },
    processing: {
        required: false,
        type: Boolean,
        default: false
    },
})

const newReport = () => {
    emit('newReport')
}

const emitSelectedAction = (value) => {
    emit('update:selectedAction', value);
}

const emitSelectedOption = (key: string, value: string | number) => {
    emit('update:selectedOption', { key, value });
}

</script>
<template>
    <q-form 
        autocorrect="off" 
        autocomplete="off" 
        ref="formContent" 
        class="row tw-w-full"
        @submit="newReport" 
        @validation-error="alert.error(i18n.tr('isite.cms.message.formInvalid'))"
    > 
        <dynamic-field
            class="col-12"
            :field="field"
            @update:modelValue="emitSelectedAction"
        />
        <!--Additional fields-->
        <dynamic-field
            v-if="optionsForBulkActions"
            v-for="(field, key) in optionsForBulkActions"
            :key="key"
            class="col-12"
            :field="field"
            @update:modelValue="value => emitSelectedOption(key, value)"
        />
        <div class="text-right col-12">
            <q-btn 
                v-if="!thereAreMessages"
                :disable="processing"
                :label="i18n.tr('isite.cms.label.dispatch')"
                color="secondary" 
                rounded unelevated 
                size="13px"
                :loading="processing"
                type="submit" 
            >
                <template v-slot:loading>
                    <i class="fa-solid fa-spinner-third fa-spin"></i>
                </template>
            </q-btn>
        </div>
    </q-form>
</template>