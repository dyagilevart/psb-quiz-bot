import { QuizService } from './quiz.service';
import { Module } from '@nestjs/common';
import { QuizModule as DBQuizModule } from 'src/DatabaseModule/QuizDBModule/quizDB.module';
import { QuestionHelperService } from './questionHelper.service';
import { UserModule } from 'src/DatabaseModule/UserModule/user.module';
import { ChartModule } from 'src/ChartModule/chart.module';

@Module({
  imports: [UserModule, DBQuizModule, ChartModule],
  providers: [QuizService, QuestionHelperService],
  exports: [QuizService, QuestionHelperService],
})
export class QuizModule {}
