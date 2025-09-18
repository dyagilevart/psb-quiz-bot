import { QuizService } from './quiz.service';
import { Module } from '@nestjs/common';
import { QuizModule as DBQuizModule } from 'src/DatabaseModule/QuizModule/quiz.module';
import { QuestionService } from './question.service';
import { UserModule } from 'src/DatabaseModule/UserModule/user.module';

@Module({
  imports: [UserModule],
  providers: [QuizService, QuestionService],
  exports: [QuizService, QuestionService],
})
export class QuizModule {}
