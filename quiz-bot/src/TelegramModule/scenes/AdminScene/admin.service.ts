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
      case data.includes(MenuEnum.NEXT):
        return MenuEnum.NEXT;

      default:
        throw new Error('Ошибка: неизвестная команда');
    }
  }

  parseQuestion(ctx: TelegrafContext): {session: string, nextQuestion: number} {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }

    const regex = /^gonext_(.{4})_(\d+)$/;
    const match = ctx.callbackQuery.data.match(regex);

    if (match) {
      return {
        session: match[1],
        nextQuestion: Number(match[2]),
      };
    } else {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }
  }

  start(ctx: TelegrafContext) {
    this._quizService.start(ctx);
  }

  next(ctx: TelegrafContext, nextQuestion: number) {
    this._quizService.goNext(ctx, nextQuestion);
  }

  stop() {
    this._quizService.stop();
  }
}
