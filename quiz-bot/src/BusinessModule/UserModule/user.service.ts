import { Injectable } from '@nestjs/common';
import { Scene } from '../types/scene.enum';
import { TelegramContext } from '../types/context';
import { Markup, Scenes } from 'telegraf';
import { UserService as DatabaseUserService } from '../../DatabaseModule/UserModule/user.service';
import { Action } from './types/action.enum';

@Injectable()
export class UserService {
  static currentScene = new Scenes.BaseScene<TelegramContext>(
    Scene.USER_CONSOLE,
  );

  constructor(private userService: DatabaseUserService) {}

  init() {
    UserService.currentScene.enter(async (ctx) => {
      if (ctx.from?.id) {
        const currentUser = await this.userService.getUser(ctx.from?.id);
        void ctx.reply(
          `Привет, ${currentUser?.name || ctx.from.first_name}`,
          Markup.inlineKeyboard([
            Markup.button.callback('Ближайшие записи', Action.MY_MEETINGS),
          ]),
        );
      } else {
        void ctx.reply('Произошла ошибка, не могу Вас найти в хранилище');
      }
    });
  }
}
