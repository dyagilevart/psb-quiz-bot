export enum MenuEnum {
    START = 'start',
    NEXT = 'next',
    STOP = 'stop'
}

export const menuButtonNames: Record<MenuEnum, string> = {
    [MenuEnum.START]: 'Начать квиз',
    [MenuEnum.NEXT]: 'Идем дальше?',
    [MenuEnum.STOP]: 'Экстренная остановка'
}