import { Injectable } from '@nestjs/common';
import { UserService } from 'src/DatabaseModule/UserModule/user.service';
import { questions as questions1 } from './questions/questions.stage1';
import { questions as questions2 } from './questions/questions.stage2';
import { questions as questions3 } from './questions/questions.stage3';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { Question } from './types/question.type';

@Injectable()
export class QuizService {
  stage: string = '';
  timers: NodeJS.Timeout[] = [];

  constructor(private userService: UserService) {}

  start(ctx: TelegrafContext) {
    if (this.stage === '') {
      this.stage = '1';
      let current = 0;
      while (current < questions1.length - 1) {
        this.timers.push(
          setTimeout(
            async (current) => {
              this.sendQuestion(ctx, questions1, current);
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
        await ctx.telegram.sendMessage(
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
        ctx.sendMessage(`Вопрос ${question.id}. ${question.text} отправлен ✅`);
      } catch (e) {
        console.error('Ошибка при отправке вопроса', e);
      }
    }
  }
}
