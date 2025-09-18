import { QuizService } from './quiz.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/DatabaseModule/UserModule/user.module';

@Module({
  imports: [UserModule],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
