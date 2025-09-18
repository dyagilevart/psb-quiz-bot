import { Injectable } from '@nestjs/common';
import { UserService } from 'src/DatabaseModule/UserModule/user.service';
import { questions as questions1 } from './questions/questions.stage1';
import { questions as questions2 } from './questions/questions.stage2';
import { questions as questions3 } from './questions/questions.stage3';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { Question } from './types/question.type';
import { Message } from 'telegraf/typings/core/types/typegram';
import { QuizDBService } from 'src/DatabaseModule/QuizDBModule/quizDB.service';

@Injectable()
export class QuizService {
  stage: string = '';
  timers: NodeJS.Timeout[] = [];
  msqs: Message.TextMessage[] = [];

  constructor(
    private userService: UserService,
    private quizDBService: QuizDBService,
  ) {}

  start(ctx: TelegrafContext) {
    if (this.stage === '') {
      this.stage = '1';
      let current = 0;
      while (current <= questions1.length) {
        this.timers.push(
          setTimeout(
            async (current) => {
              await this.clearMessages(ctx);
              if (current < questions1.length) {
                this.sendQuestion(ctx, questions1, current);
              } else {
                this.sendResult(ctx, this.stage, questions1.length);
              }
            },
            current * 30000,
            current,
          ),
        );
        current++;
      }
    }
  }

  stop() {
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  async sendQuestion(
    ctx: TelegrafContext,
    questions: Question[],
    current: number,
  ) {
    const users = await this.userService.getActiveUsers();
    const question = questions[current];

    for (let i = 0; i < users.length; i++) {
      try {
        let msg = await ctx.telegram.sendMessage(
          users[i].chatId,
          `<code>Вопрос ${question.id}/${questions.length}</code>
          
${question.text}
          
Ответы:
${question.answers.map((answer) => `${answer.id}. ${answer.text}`).join('\n')}`,
          {
            reply_markup: {
              inline_keyboard: [
                question.answers.map((answer) => ({
                  text: answer.id,
                  callback_data: `answer_${this.stage}_${question.id}_${answer.id}`,
                })),
              ],
            },
            parse_mode: 'HTML',
          },
        );
        this.msqs.push(msg);
        ctx.sendMessage(`Вопрос ${question.id}. ${question.text} отправлен ✅`);
      } catch (e) {
        console.error('Ошибка при отправке вопроса', e);
      }
    }
  }

  async clearMessages(ctx: TelegrafContext) {
    await Promise.all(
      this.msqs.map(async (msg) => {
        try {
          await ctx.telegram.deleteMessage(msg.chat.id, msg.message_id);
          ctx.telegram.sendMessage(msg.chat.id, `Время вышло ⏰`);
          return true;
        } catch {
          return true;
        }
      }),
    );
    this.msqs = [];
    return;
  }

  async sendResult(ctx: TelegrafContext, stage: string, totalCount: number) {
    const users = await this.userService.getActiveUsers();
    users.forEach(async (user) => {
      const count = await this.quizDBService.getRightAnswersCount(
        stage,
        user.userId,
      );
      ctx.telegram.sendPhoto(
        user.chatId,
        { source: 'src/assets/photo/result.png' },
        { caption: `Вы ответили правильно на ${count} из ${totalCount}` },
      );
    });
  }
}
