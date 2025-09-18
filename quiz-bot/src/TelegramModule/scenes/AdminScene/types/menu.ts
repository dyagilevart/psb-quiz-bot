export enum MenuEnum {
    START = 'start',
    STOP = 'stop'
}

export const menuButtonNames: Record<MenuEnum, string> = {
    [MenuEnum.START]: 'Начать квиз',
    [MenuEnum.STOP]: 'Экстренная остановка'
}