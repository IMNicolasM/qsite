import { defineAsyncComponent} from "vue";

export default {  
  'colorCell':  defineAsyncComponent(() => import('modules/qsite/_components/master/contentType/components/colorCell')),
  'date':  defineAsyncComponent(() => import('modules/qsite/_components/master/contentType/components/date')),  
}
