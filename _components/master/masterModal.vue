<template>
  <q-dialog
    v-model="show"
    :class="`master-dialog${customPosition ? '-custom' : ''}`"
    v-on="$attrs"
    :maximized="maximized"
    :persistent="persistent"
    :position="customPosition ? 'right' : 'standard'"
    :style="masterModalWidthSize"
  >
    <!--Content-->
    <div :id="id || 'masterModalContent'" :style="customPosition ? '' : `min-width: ${width}`"
          v-if="show" class="master-dialog__content round relative-position" :class="customClass">
      <!--Header-->
      <div :class="`master-dialog__header text-${color} row justify-between items-center`">
        <!--Title-->
        <div class="master-dialog__header-title row items-center">
          <q-icon v-if="icon" :name="icon" class="q-mr-sm" size="20px" />
          <b>{{ title }}</b>
          <q-chip
            v-if="chip"
            class="tw-ml-3 tw-font-medium"
            square
            v-bind="chip"
          />
        </div>
        <!--Close Button-->
        <q-btn v-close-popup icon="fa-light fa-xmark" round textColor="grey-7" unelevated class="btn-medium"
                v-if="!hideCloseAction" size="14px" dense />
      </div>
      <q-separator class="tw-h-0.5" />
      <!--Slot content-->
      <div class="master-dialog__body">
        <slot />
      </div>
      <!--Actions Content-->
      <div class="master-dialog__actions" v-if="actions && actions.length">
        <div class="row justify-end q-gutter-sm">
          <template v-for="(btn, keyBtn) in actions" :key="keyBtn">
            <q-btn
              v-if="btn.props?.vIf != undefined ? btn.props?.vIf : true"
              v-bind="{...actionBtnProps, ...(btn.props || {})}"
              @click="btn.action ? btn.action() : null"
              :loading="btn?.props?.loading || false"
            />
          </template>
        </div>
      </div>
      <!--Loading-->
      <inner-loading :visible="loading" />
    </div>
  </q-dialog>
</template>

<script>
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    persistent: { type: Boolean, default: false },
    color: { type: String, default: 'grey-9' },
    width: { type: String, default: '400px' },
    title: { type: String },
    icon: { type: String },
    actions: { type: Array },
    id: { type: String },
    maximized: { type: Boolean, default: false },
    hideCloseAction: { type: Boolean, default: false },
    customPosition: { type: Boolean, default: false },
    modalWidthSize: { type: String, default: '65vw' },
    customClass: { type: String, default: '' },
    chip: { type: Object || null, default: null }
  },
  emits: ['update:modelValue'],
  components: {},
  watch: {
    modelValue(newValue, oldValue) {
      this.show = this.$clone(newValue);
    },
    show(newValue, oldValue) {
      this.$emit('update:modelValue', this.$clone(newValue));
    }
  },
  mounted() {
    this.$nextTick(function() {
    });
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    actionBtnProps() {
      return {
        rounded: true,
        unelevated: true,
        noCaps: true,
        class: 'btn-small'
      };
    },
    masterModalWidthSize() {
      return {
        '--modal-width-size': this.modalWidthSize
      };
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.master-dialog {
  &__content {
    background: white;
  }

  &__header {
    padding: 16px;
    font-size: 16px;
    background: white;
  }

  &__body {
    padding: 0 16px;
    margin: 16px 0;
    overflow-y: auto;
  }

  &__actions {
    padding: 0 16px 8px 16px;

    .q-btn {
      .q-icon {
        font-size: 20px;
      }
    }
  }
}

.master-dialog .master-dialog__body {
  max-height: calc(100vh - 240px);

  @media screen and (max-width: $breakpoint-md) {
    max-height: calc(100vh - 150px);
  }
}

.master-dialog-custom{
  .q-dialog__inner {
    padding: 15px 0 0 0;
    width: var(--modal-width-size);

    @media screen and (max-width: $breakpoint-md) {
      width: 90vw;
    }

    @media screen and (max-width: $breakpoint-xs) {
      width: 100vw;
    }
  }

  .master-dialog {
    &__content {
      height: 100%;
      max-height: 100%;
      width: 100%;
      max-width: 100%;
      border-radius: $custom-radius 0 0 0 !important;
    }

    &__body {
      height: calc(100vh - 173px);
    }
  }
}
</style>
