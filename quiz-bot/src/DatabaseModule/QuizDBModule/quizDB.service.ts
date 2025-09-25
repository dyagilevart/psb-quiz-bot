/*
https://docs.nestjs.com/providers#services
*/

import { QuizDto } from '@dto/quiz.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '@schemas/quiz.schema';
import { Model } from 'mongoose';
import { UserService } from '../UserModule/user.service';

@Injectable()
export class QuizDBService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    private userService: UserService,
  ) {}

  async setAnswer(answer: QuizDto): Promise<QuizDto> {
    const newAnswer = new this.quizModel(answer);
    return await newAnswer.save();
  }

  async getRightAnswersCount(userId: number) {
    return (await this.quizModel.find({ userId, correct: true })).length;
  }

  async getStatistic(option: string, question: string) {
    return (await this.quizModel.find({ id: question, answer: option })).length;
  }

  async getWinner() {
    const users = await this.userService.getActiveUsers();
    let rightAnswers: { userId: number; count: number }[] = [];

    for (let i = 0; i < users.length; i++) {
      rightAnswers.push({
        userId: users[i].userId,
        count: await this.getRightAnswersCount(users[i].userId),
      });
    }

    rightAnswers = rightAnswers.sort((a, b) => b.count - a.count);

    if (rightAnswers.length > 0) {
      return rightAnswers[0];
    } else {
      throw 'Никто не захотел поучаствовать 😭';
    }
  }
}
