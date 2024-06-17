<template>
  <div class="banner-wrapper">
      <div 
        :class="classWrapper"
        class="banner" 
        @click="action"
      >
        <q-icon
            v-if="icon && icon.name"
            :size="icon.size" 
            :name="icon.name"
            :class="icon.class"
            class="q-mr-sm" 
          />
          <marquee v-if="marquee">{{ message }}</marquee>
          <span v-else-if="!marquee">{{ message }}</span>
      </div>
  </div>
</template>

<script>
import { eventBus } from 'src/plugins/utils'

export default {
    name: "bannerAlert",
    data: () => {
      return {
        eventBus
      }
    },
    props: {
      classWrapper: {
        type: String,
        default: ''
      },
      marquee: {
        type: Boolean,
        default: false,
      },
      icon: {
        type: Object,
        default: () => ({})
      },
      message: {
        type: String,
        default: ''
      },
      action: {
        type: Function,
        default: () => {}
      }
    },
}
</script>

<style lang="scss">
  .banner-wrapper {
    position: relative;
    min-height: 30px;
  }
  .banner {
    position: fixed;
    top: 0;
    padding: 5px;
    text-align: center;
    width: 100%;
    z-index: 1000;
    @media(min-width: 1024px){
      top: 50px;
      border-radius: 10px 0 0 0;
    }
  }
</style>
