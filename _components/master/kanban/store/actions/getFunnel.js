import kanbanStore from '@imagina/qsite/_components/master/kanban/store/kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function getFunnel() {
    try {
        const response = await baseService.index('apiRoutes.qrequestable.categories');
        kanbanStore().setFunnelList(response.data);
        const funnel = response.data.sort((a, b)  => {
            const compare = a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase());
            return compare === 0 && a.title !== b.title ? b.title.localeCompare(a.title) : compare;
          }).shift();
        kanbanStore().setFunnelSelected(funnel.id);
    } catch (error) {
        console.log(error);
    }
}