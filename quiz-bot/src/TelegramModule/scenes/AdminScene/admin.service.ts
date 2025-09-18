/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { menuButtonNames, MenuEnum } from './types/menu';
import { QuizService } from 'src/BusinessModule/QuizModule/quiz.service';

@Injectable()
export class AdminService {
  constructor(private _quizService: QuizService) {}

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
      {
        command: MenuEnum.STOP,
        description: menuButtonNames[MenuEnum.STOP],
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
            {
              callback_data: MenuEnum.STOP,
              text: menuButtonNames[MenuEnum.STOP],
            },
          ],
        ],
      },
    });
  }

  parseCallback(ctx: TelegrafContext): MenuEnum {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }

    const data = ctx.callbackQuery.data;
    switch (true) {
      case data.includes(MenuEnum.START):
        return MenuEnum.START;
      case data.includes(MenuEnum.STOP):
        return MenuEnum.STOP;

      default:
        throw new Error('Ошибка: неизвестная команда');
    }
  }

  start(ctx: TelegrafContext) {
    this._quizService.start(ctx);
  }

  stop() {
    this._quizService.stop();
  }
}
