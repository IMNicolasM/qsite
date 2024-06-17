import { colors } from 'quasar'
import { TypesOfMessages, Message } from '../models/interfaces'

export const prepareMessageObject = (
    messages: Message[], 
    typesOfMessages: TypesOfMessages
): Message[] | [] => {
    const { getPaletteColor } = colors
    return messages.map((message: Message) => (
        typesOfMessages[message.type] 
            ? {
                ...message,
                icon: typesOfMessages[message.type].icon,
                color: getPaletteColor(typesOfMessages[message.type].color)
            } 
            : { ...message }
    ))
}