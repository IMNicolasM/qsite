<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
    rows: {
        required: true,
        type: Array,
        default: () => {
            return []
        }
    },
    columns: {
        required: true,
        type: Array,
        default: () => {
            return []
        }
    },
    initialPagination: Object
})
</script>
<template>
    <q-table
        card-class="tw-rounded-xl"
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        virtual-scroll
        :pagination="initialPagination"
        separator="none"
    >
        <template v-slot:header="props">
            <q-tr 
                :props="props" 
                class="tw-bg-gray-100 tw-z-10 tw-sticky tw-top-0"
            >
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    <b class="tw-text-gray-500 tw-text-sm">
                        {{ col.label }}
                    </b>
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body-cell-icon="props">
            <q-td :props="props">
                <q-icon 
                    :name="props.row.icon.name"
                    :class="props.row.icon.color"
                    size="16px"
                />
            </q-td>
        </template>
    </q-table>
</template>