import kanbanStore from '../kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function updateColumn(data) {
    try {
        const payloadStatus = kanbanStore().getPayloadStatus();
        payloadStatus.id = data.id;
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus.categoryId = kanbanStore().getFunnelSelected();
        await baseService.update('apiRoutes.qrequestable.statuses', data.id, payloadStatus)
    } catch (error) {
        console.log(error);
        kanbanStore().setPayloadStatus();
    }
}