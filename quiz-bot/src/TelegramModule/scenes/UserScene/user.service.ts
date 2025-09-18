/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { QuestionService } from 'src/BusinessModule/QuizModule/question.service';

@Injectable()
export class UserService {
  constructor(private _questionService: QuestionService) {}

  parseCallback(ctx: TelegrafContext): {
    stage: string;
    question: string;
    answer: string;
  } {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }

    const regex = /^answer_(\d+)_(\d+)_(\d+)$/;
    const match = ctx.callbackQuery.data.match(regex);

    if (match) {
      return {
        stage: match[1],
        question: match[2],
        answer: match[3],
      };
    } else {
      ctx.answerCbQuery('Ошибка: ответ не распознан');
      throw new Error('Ошибка: ответ не распознан');
    }
  }

  async workWithAnswer(userId: number, ctx: TelegrafContext) {
    const { stage, question, answer } = this.parseCallback(ctx);
    const isCorrect = this._questionService.check(stage, question, answer);
    const questionObject = this._questionService.getQuestion(stage, question);
    this._questionService.saveQuestion(userId, stage, question, answer);
    await ctx.sendMessage(
      `<code>${isCorrect ? '✅ Правильно!' : '😑 Неправильно'}</code>
          
${questionObject?.solution.text}`,
      {
        parse_mode: 'HTML',
      },
    );
  }
}
