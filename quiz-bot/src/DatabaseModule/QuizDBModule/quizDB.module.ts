import { MongooseModule } from '@nestjs/mongoose';
import { QuizDBService } from './quizDB.service';
import { Module } from '@nestjs/common';
import { Quiz, QuizSchema } from '@schemas/quiz.schema';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  controllers: [],
  providers: [QuizDBService],
  exports: [QuizDBService],
})
export class QuizModule {}
