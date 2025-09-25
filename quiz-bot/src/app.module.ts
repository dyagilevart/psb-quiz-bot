import { BusinessModule } from './BusinessModule/business.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import teleramConfig from './config/telegram.config';

import { DatabaseModule } from './DatabaseModule/database.module';
import { TelegramModule } from './TelegramModule/telegram.module';
import moment from 'moment';

@Module({
  imports: [
    BusinessModule,
    ConfigModule.forRoot({
      load: [dbConfig, teleramConfig],
    }),
    DatabaseModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {
  constructor() {
    moment.locale('ru');
  }
}
