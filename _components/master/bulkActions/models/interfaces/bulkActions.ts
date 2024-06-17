
export interface Fields {
    [key: string]: {
        loadOptions?: {
            apiRoute: string,
            select: {
                id: string,
                label: string,
            }
        },
        props?: object,
        required?: boolean,
        type: string,
        value: string,
    }
}
export interface BulkActions {
    apiRoute: string,
    name: string,
    title: string,
    fields?: Fields,
    permission?: string,
}