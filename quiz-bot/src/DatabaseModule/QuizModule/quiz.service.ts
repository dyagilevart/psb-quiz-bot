/*
https://docs.nestjs.com/providers#services
*/

import { CreateUserDto } from '@dto/create-user.dto';
import { QuizDto } from '@dto/quiz.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '@schemas/quiz.schema';
import { User } from '@schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuizService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async setAnswer(answer: QuizDto): Promise<QuizDto> {
    const newAnswer = new this.quizModel(answer);
    return await newAnswer.save();
  }
}
