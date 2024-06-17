import baseService from 'modules/qcrud/_services/baseService'

export const getConfig = async (route: any, helper: any) => {
    try {
        const routeParams = helper.getInfoFromPermission(route.meta.permission);
        if (!routeParams) return

        const configName = `${routeParams.module}.config.bulkActions.${routeParams.entity}`;

        const requestParams = {
            refresh: true,
            params: {
                filter: {
                    configName
                }
            }
        };

        const { data } = await baseService.index('apiRoutes.qsite.configs', requestParams)
        return data
    } catch (error) {
        throw new Error('Error in config request')
    }
}