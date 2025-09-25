import { Injectable } from '@nestjs/common';
import { questions } from './questions/questions.stage1';
import { Question } from './types/question.type';
import { QuizDBService } from 'src/DatabaseModule/QuizDBModule/quizDB.service';

@Injectable()
export class QuestionHelperService {
  constructor(private _quizDBService: QuizDBService) {}

  getQuestion(questionId: string): Question | undefined {
    return questions.find((question) => question.id === questionId);
  }

  check(questionId: string, answer: string): boolean {
    const question = this.getQuestion(questionId);

    if (question) {
      return question.solution.id === answer;
    }

    throw `Не удалось найти вопрос с параметрами ${questionId}. ${answer}`;
  }

  async saveQuestion(userId: number, question: string, answer: string) {
    await this._quizDBService.setAnswer({
      answer: answer,
      correct: this.check(question, answer),
      id: question,
      userId,
    });
  }
}
