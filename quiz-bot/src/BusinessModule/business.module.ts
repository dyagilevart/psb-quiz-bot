/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/DatabaseModule/database.module';
import { AdminModule } from './AdminModule/admin.module';
import { RegistrationModule } from './RegistrationModule/registration.module';
import { QuizModule } from './QuizModule/quiz.module';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
    RegistrationModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
  exports: [RegistrationModule, AdminModule, QuizModule],
})
export class BusinessModule {}
