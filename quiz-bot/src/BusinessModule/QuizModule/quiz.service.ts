import { Injectable } from '@nestjs/common';
import { UserService } from 'src/DatabaseModule/UserModule/user.service';
import { questions } from './questions/questions.stage1';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { Question } from './types/question.type';
import { Message } from 'telegraf/typings/core/types/typegram';
import { QuizDBService } from 'src/DatabaseModule/QuizDBModule/quizDB.service';
import { generateRandomCode } from './helper/random';
import { ChartService } from 'src/ChartModule/chart.service';

@Injectable()
export class QuizService {
  session: string;
  current = 0;
  timers: NodeJS.Timeout[] = [];
  msqs: Message.TextMessage[] = [];

  constructor(
    private userService: UserService,
    private quizDBService: QuizDBService,
    private chartService: ChartService,
  ) {}

  start(ctx: TelegrafContext) {
    this.session = generateRandomCode(4);
    this.goNext(ctx, this.current);
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
                  callback_data: `answer_${question.id}_${answer.id}`,
                })),
              ],
            },
            parse_mode: 'HTML',
          },
        );
        this.msqs.push(msg);
      } catch (e) {
        console.error('Ошибка при отправке вопроса', e);
      }
    }

    ctx.sendMessage(`Вопрос ${question.id}. ${question.text} отправлен ✅`);
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

  async sendWinner(ctx: TelegrafContext) {
    const winner = await this.quizDBService.getWinner();
    ctx.telegram.sendPhoto(winner.userId, {
      source: 'src/assets/photo/winner.png',
    });
    ctx.reply(`Победитель выбран! ${winner.userId}`);
  }

  async sendResult(ctx: TelegrafContext, totalCount: number) {
    const users = await this.userService.getActiveUsers();
    users.forEach(async (user) => {
      const count = await this.quizDBService.getRightAnswersCount(user.userId);
      ctx.telegram.sendPhoto(
        user.chatId,
        { source: 'src/assets/photo/result.png' },
        { caption: `Вы ответили правильно на ${count} из ${totalCount}` },
      );
    });
  }

  async generateStatistic(question: number) {
    const options = questions[question].answers.map((answer) => answer.id);
    const results: number[] = [];
    for (let i = 0; i < options.length; i++) {
      results.push(
        await this.quizDBService.getStatistic(
          options[i],
          questions[question].id,
        ),
      );
    }
    const colorScheme: string[] = questions[question].answers.map((answer) =>
      answer.id === questions[question].solution.id ? '#51cf66' : '#4facfe',
    );

    return await this.chartService.generateStatistic(results, {
      colorScheme,
    });
  }

  async goNext(ctx: TelegrafContext, question: number) {
    if (question < questions.length) {
      this.sendQuestion(ctx, questions, question);
      this.timers.push(
        setTimeout(async () => {
          await this.clearMessages(ctx);
          const chart = await this.generateStatistic(question);
          ctx.replyWithPhoto(
            { source: chart },
            {
              caption: `Вопрос ${questions[question].id}. ${questions[question].text} завершен.`,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Идем дальше?',
                      callback_data: `gonext_${this.session}_${question + 1}`,
                    },
                  ],
                ],
              },
            },
          );
        }, 30000),
      );
    } else {
      await this.sendResult(ctx, questions.length);
      await this.sendWinner(ctx);
    }
  }
}
