import { Fields } from './bulkActions';

export interface SelectedAction {
    label: string,
    value: string,
    apiRoute: string,
    fields?: Fields
}