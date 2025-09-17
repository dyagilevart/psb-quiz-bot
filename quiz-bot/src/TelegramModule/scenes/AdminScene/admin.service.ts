/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { menuButtonNames, MenuEnum } from './types/menu';

@Injectable()
export class AdminService {
  constructor() { }

  welcomeAdmin(ctx: TelegrafContext) {
    ctx.reply('Приветствую в консоли администратора');
    this.renderMenu(ctx);
  }

  renderMenu(ctx: TelegrafContext) {
    ctx.telegram.setMyCommands([
      {
        command: MenuEnum.START,
        description: menuButtonNames[MenuEnum.START],
      },
    ]);
    ctx.reply('Выберите нужную команду', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              callback_data: MenuEnum.START,
              text: menuButtonNames[MenuEnum.START],
            },
          ],
        ],
      },
    });
  }
}
