import { MongooseModule } from '@nestjs/mongoose';
import { QuizService } from './quiz.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '@schemas/user.schema';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
