import baseService from 'modules/qcrud/_services/baseService'
import { SelectedAction } from '../models/interfaces/selectedAction'
import { alert, i18n } from 'src/plugins/utils'

export const sendReport = async (
    confirmed: boolean, 
    selectedAction: SelectedAction | null, 
    optionsForSelectedBulkActions: { [key: string]: string },
    dynamicFilterValues: any,
    permission: string
) => {
    try {
        const payload = {
            apiRoute: selectedAction?.apiRoute,
            title: selectedAction?.label,
            name: selectedAction?.value,
            type: permission,
        }

        const requestParams = {
            bulkAction : {
                ...payload,
                fields: {
                    ...optionsForSelectedBulkActions
                },
            },
            confirmed,
            filter: {
                ...dynamicFilterValues
            }
        };

        const response = await baseService.post(
            payload?.apiRoute, 
            requestParams
        )
        
        if (confirmed) {
            alert.info(
                i18n.tr('isite.cms.messages.actionSuccessfullyDispatched')
            )
        }

        return response
    } catch (error) {
        console.error(error);
        alert.error(
            i18n.tr('isite.cms.messages.errorDispatchingAction')
        )
    }
}