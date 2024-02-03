import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import {debounce} from 'quasar';
import handleGrid from '@imagina/qsite/_components/v3/handleGrid/index.vue';

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.proxy

  // Refs
  const refs = {}

  // States
  const state = reactive({})

  // Computed
  const computeds = {}

  // Methods
  const methods = {
    //Return the default actions props by action
    getActionsButtonProps: (action = {}) => ({
      icon: 'fa-regular fa-objects-column',
      outline: true,
      round: true,
      color: 'cyan',
      size: '10px',
      ...action,
      label: ''
    }),
    //Add element
    emitCreateElement(parent = null) {
      emit('create', parent || props.parent)
    },
    //Check if exist key in the element
    verifyKeys(element, key) {
      const arrayKeys = Object.keys(element);
      return arrayKeys.includes(key)
    }
  }

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(() => props.value, (newField, oldField): void => {
  //   console.warn(">>>>>>>> Watch")
  //   props.elements = computeds.orderedItems
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
