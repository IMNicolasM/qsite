<template>
  <div
    class="
      tw-space-y-2
      tw-border
      tw-border-gray-200
      tw-rounded-md
    "
    :class="{'tw-border-none': fieldProps?.disabledBorder }"
    >
    <div
      class="
        tw-w-full
        tw-px-3
        tw-py-2
        tw-text-xs
        tw-font-light
        tw-border-b
        tw-border-gray-200
        tw-text-gray-500
      "
      :class="{'tw-hidden': fieldProps?.disabledLabel }"
    >
      {{ fieldProps.label }}
    </div>
    <div class="tw-flex tw-justify-center tw-py-4" v-if="loading">
      <i class="fa-solid fa-cog fa-spin tw-text-blue-800 tw-text-3xl" />
    </div>
    <div v-if="!loading">
      <draggable
        v-model="fields"
        :animation="200"
        handle=".dot-vertical"
        class="tw-h-500"
        :class="{'tw-overflow-y-scroll': fields.length > 0}"
        ref="refDraggable"
        item-key="id"
      >
        <template #item="{ element, index }">
          <div
            :key="index"
            class="
              row
              q-col-gutter-xs
              tw-mb-1
              tw-border
              tw-border-gray-200
              tw-mx-3
              tw-px-2
              tw-rounded-md
              tw-mt-1
            "
          >
            <div
              class="tw-w-full"
              v-if="fieldProps.isDraggable"
            >
              <i
                class="
                tw-cursor-move
                fa-solid
                fa-grip-dots
                dot-vertical
                tw-text-sm
                tw-text-gray-500
              "
              />
            </div>
            <div
              v-for="key in Object.keys(element)"
              :key="key"
              :class="formFields[index][key] && formFields[index][key].colClass"
            >
              <dynamic-field
                v-model="fields[index][key]"
                :field="tranformField(formFields[index][key], index, fields[index])"
              />
            </div>
            <div class="tw-w-full tw-flex tw-justify-between">
              <div v-if="summary">
                <p class="tw-text-sm tw-text-gray-500">{{ summary(fields[index], index) }}</p>
              </div>
              <div class="tw-text-right">
                <q-btn
                  color="red"
                  icon="fa-light fa-trash-can"
                  size="xs"
                  flat
                  round
                  :disabled="isMinQuantity"
                  @click="deleteItem(index)"
                >
                  <q-tooltip>
                    {{ $tr('isite.cms.label.delete') }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>


          </div>
        </template>
        <div
          v-if="fields.length === 0"
          class="
           tw-w-full
           tw-text-center
           tw-text-sx
           tw-text-gray-500
           tw-py-2"
        >
          <div class="tw-mb-1 tw-text-lg">
            <i class="fa-light fa-face-thinking" />
          </div>
          No data
        </div>
      </draggable>
      <div
        class="
         tw-my-2
         tw-px-2
         tw-w-full
         tw-text-right"
      >
        <q-btn
          color="primary"
          icon="fa-light fa-plus"
          @click="add"
          size="xs"
          round
          class="tw-ml-2"
          :disabled="maxQuantity"
        >
          <q-tooltip>
            {{$tr('isite.cms.label.add')}}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import multipleDynamicFieldsController from "../controllers/multipleDynamicFields.controller";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    draggable,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    fieldProps: {
      type: Object as any,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    return { ...multipleDynamicFieldsController(props, emit) };
  },
});
</script>

<style scoped src="../assets/styles/styles.css">
</style>
