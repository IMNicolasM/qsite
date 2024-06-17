export interface Message {
    message: string,
    type: 'info' | 'warning',
    icon?: string,
    color?: string
}