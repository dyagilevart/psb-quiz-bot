import { TelegramUpdate } from './telegram.update';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middleware/session.middleware';
import { BusinessModule } from 'src/BusinessModule/business.module';
import { AdminScene } from './scenes/AdminScene/admin.scene';
import { UserScene } from './scenes/UserScene/user.scene';
import { AppointmentService } from './scenes/Stage1/appointment.service';
import { AppointmentScene } from './scenes/Stage1/stage1.scene';
import { AdminService } from './scenes/AdminScene/admin.service';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                token: configService.get<string>('token') || '',
                middlewares: [sessionMiddleware]
            }),
            inject: [ConfigService],
        }),
        BusinessModule
    ],
    providers: [TelegramUpdate, AdminScene, UserScene, AppointmentScene, AppointmentService, AdminService],
})
export class TelegramModule { }
