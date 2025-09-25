import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';

export const HelloController = (ctx: TelegrafContext) => {
    ctx.replyWithPhoto({ source: 'src/assets/photo/welcome.png' }, {
        caption: `🎮 Добро пожаловать на дизайн-арену!

Сегодня ты становишься детективом интерфейсов. Твоя миссия — найти UX-ошибки, расшифровать термины и принять правильные дизайн-решения.

Уровень сложности: от новичка до эксперта
Время на миссию: 15 минут
Награда: знания + место в зале славы

Готов принять вызов? Квиз скоро начнется!

Пусть сила дизайна будет с тобой! ⚡️`});

}