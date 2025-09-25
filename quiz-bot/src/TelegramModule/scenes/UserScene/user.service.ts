/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { QuestionHelperService } from 'src/BusinessModule/QuizModule/questionHelper.service';

@Injectable()
export class UserService {
  constructor(private _questionHelperService: QuestionHelperService) {}

  parseCallback(ctx: TelegrafContext): {
    question: string;
    answer: string;
  } {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }

    const regex = /^answer_(\d+)_(\d+)$/;
    const match = ctx.callbackQuery.data.match(regex);

    if (match) {
      return {
        question: match[1],
        answer: match[2],
      };
    } else {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }
  }

  async workWithAnswer(userId: number, ctx: TelegrafContext) {
    try {
      const { question, answer } = this.parseCallback(ctx);
      await ctx.deleteMessage(ctx.msgId);
      const isCorrect = this._questionHelperService.check(
        question,
        answer,
      );
      const questionObject = this._questionHelperService.getQuestion(
        question,
      );
      this._questionHelperService.saveQuestion(userId, question, answer);

      await ctx.sendMessage(
        `<code>${isCorrect ? '✅ Правильно!' : '😑 Неправильно'}</code>
          
${questionObject?.solution.text}`,
        {
          parse_mode: 'HTML',
        },
      );
    } catch {
      console.error(
        `Пользователь ${userId} пытался ответить на вопрос, но не успел`,
      );
    }
  }
}
