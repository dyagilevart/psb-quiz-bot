import { QuizDto } from '@dto/quiz.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaceDocument = HydratedDocument<QuizDto>;

@Schema()
export class Quiz {
  @Prop({ required: true })
  stage: string;
  @Prop({ required: true })
  id: number;
  @Prop({ required: true })
  userId: number;
  @Prop({ required: true })
  answer: string;
  @Prop({ required: true })
  correct: boolean;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
