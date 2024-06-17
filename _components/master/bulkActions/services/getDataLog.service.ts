import baseService from 'modules/qcrud/_services/baseService'
import { ActionsStatus } from '../models/interfaces'

export const getDataLog = async (status: ActionsStatus, permission: string) => {
    try {
        const response = await baseService.index(
            'apiRoutes.qsite.bulkActions', 
            { 
                refresh: true, 
                params: { 
                    filter: { 
                        type: permission
                    }
                }
            }
        )
        const data = response.data
        data.map(item => {
            item.icon = status[item.statusId].icon;
        })
        return data;
    } catch (error) {
        throw new Error('Error in the request for actions')
    }
}
