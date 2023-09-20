import Vue, { computed, onBeforeMount } from "vue";
import store from "@imagina/qsite/_components/master/kanban/modals/analytics/store";
import changeDate from '../actions/changeDate'
import show from '../actions/show'

export default function useModalAnalytics() {
    const loading = computed(() => store.loading);
    const showModal = computed({
        get: () => store.showModal,
        set(value) {
            store.showModal = value
        }
    });
    const filterDate = computed({
        get: () => store.filterDate,
        async set(value) {
            store.filterDate = value
            await changeDate();
            await show();
        }
    });
    const field = computed(() => ({
        date: {
            value: null,
            type: 'select',
            props: {
                label: Vue.prototype.$tr('isite.cms.form.date'),
                clearable: true,
                options: [
                    {label: Vue.prototype.$tr('isite.cms.label.customRange'), value: 'customRange'},
                    {label: Vue.prototype.$tr('isite.cms.label.today'), value: 'today'},
                    {label: Vue.prototype.$tr('isite.cms.label.yesterday'), value: 'yesterday'},
                    {label: Vue.prototype.$tr('isite.cms.label.tomorrow'), value: 'tomorrow'},
                    {label: Vue.prototype.$tr('isite.cms.label.LastNumDays', {numDays: 7}), value: 'lastSevenDays'},
                    {label: Vue.prototype.$tr('isite.cms.label.LastNumDays', {numDays: 30}), value: 'lastThirtyDays'},
                    {label: Vue.prototype.$tr('isite.cms.label.LastNumDays', {numDays: 60}), value: 'lastSixtyDays'},
                    {label: Vue.prototype.$tr('isite.cms.label.currentWeek'), value: 'currentWeek'},
                    {label: Vue.prototype.$tr('isite.cms.label.lastWeek'), value: 'lastWeek'},
                    {label: Vue.prototype.$tr('isite.cms.label.nextWeek'), value: 'nextWeek'},
                    {label: Vue.prototype.$tr('isite.cms.label.currentMonth'), value: 'currentMonth'},
                    {label: Vue.prototype.$tr('isite.cms.label.lastMonth'), value: 'lastMonth'},
                    {label: Vue.prototype.$tr('isite.cms.label.nextMonth'), value: 'nextMonth'},
                    {label: Vue.prototype.$tr('isite.cms.label.numMonthsAgo', {numMonths: 2}), value: 'twoMonthsAgo'},
                    {label: Vue.prototype.$tr('isite.cms.label.currentYear'), value: 'currentYear'},
                    {label: Vue.prototype.$tr('isite.cms.label.lastYear'), value: 'lastYear'},
                    {label: Vue.prototype.$tr('isite.cms.label.numYearsAgo', {numYears: 2}), value: 'twoYearsAgo'},
                    {label: Vue.prototype.$tr('isite.cms.label.lastNumYears', {numYears: 2}), value: 'lastTwoYears'},
                ]
            }
        }
    }))
    
    const chartsData = computed(() => store.chartsData);
    onBeforeMount(() => {
        store.reset();
    })
    return {
        chartsData, 
        showModal, 
        loading,
        field,
        filterDate,
    };
}
