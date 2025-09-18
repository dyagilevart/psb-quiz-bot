/*
https://docs.nestjs.com/providers#services
*/

import { QuizDto } from '@dto/quiz.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '@schemas/quiz.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuizDBService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async setAnswer(answer: QuizDto): Promise<QuizDto> {
    const newAnswer = new this.quizModel(answer);
    return await newAnswer.save();
  }

  async getRightAnswersCount(stage: string, userId: number) {
    return (await this.quizModel.find({ stage, userId, correct: true })).length;
  }
}
