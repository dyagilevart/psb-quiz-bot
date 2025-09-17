import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlaceDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  userId: number;

  @Prop()
  name: string;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
