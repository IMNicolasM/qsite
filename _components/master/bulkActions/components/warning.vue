<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
    messages: {
        required: true,
        type: Array,
        default: () => {
            return []
        }
    }
})
</script>
<template>
    <div
        v-for="message in messages"
        class="
            tw-flex 
            tw-item-center
            tw-rounded-xl
            tw-p-3
        "
        :style="{ backgroundColor: `${message.color}2a`}"
    >
        <!--Icon-->
        <q-icon
            :name="message.icon"
            :style="{ color: message.color }"
            size="20px"
        />
        <!--message-->
        <p class="tw-ml-2" v-html="message.message" />
    </div>
</template>