import { Injectable } from '@nestjs/common';
import { questions as questions1 } from './questions/questions.stage1';
import { questions as questions2 } from './questions/questions.stage2';
import { questions as questions3 } from './questions/questions.stage3';
import { Question } from './types/question.type';
import { QuizDBService } from 'src/DatabaseModule/QuizDBModule/quizDB.service';

@Injectable()
export class QuestionHelperService {
  constructor(private _quizDBService: QuizDBService) {}

  getQuestion(stage: string, questionId: string): Question | undefined {
    let questions: Question[] = [];

    if (stage === '1') {
      questions = questions1;
    }
    if (stage === '2') {
      questions = questions2;
    }
    if (stage === '3') {
      questions = questions3;
    }

    return questions.find((question) => question.id === questionId);
  }

  check(stage: string, questionId: string, answer: string): boolean {
    const question = this.getQuestion(stage, questionId);

    if (question) {
      return question.solution.id === answer;
    }

    throw `Не удалось найти вопрос с параметрами ${stage}, ${questionId}. ${answer}`;
  }

  async saveQuestion(
    userId: number,
    stage: string,
    question: string,
    answer: string,
  ) {
    await this._quizDBService.setAnswer({
      answer: answer,
      correct: this.check(stage, question, answer),
      id: question,
      stage,
      userId,
    });
  }
}
