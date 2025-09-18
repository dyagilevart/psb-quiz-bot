import { Injectable } from '@nestjs/common';
import { Scene } from '../types/scene.enum';
import { Markup, Scenes } from 'telegraf';
import { Action } from './types/action.enum';
import { UserService } from 'src/DatabaseModule/UserModule/user.service';
import { TelegramContext } from '../types/context';

@Injectable()
export class AdminService {
  static currentScene = new Scenes.BaseScene<TelegramContext>(
    Scene.ADMIN_CONSOLE,
  );

  constructor(private userService: UserService) {}

  init() {
    AdminService.currentScene.enter(async (ctx) => {
      if (ctx.from?.id && (await this.isAdmin(ctx.from?.id))) {
        void ctx.reply(
          'Вы в консоли администратора. Выберите действие',
          Markup.inlineKeyboard([
            Markup.button.callback('Start', Action.START),
            Markup.button.callback('Stop', Action.STOP),
          ]),
        );
      }
    });
  }

  async isAdmin(userId: number) {
    const user = await this.userService.getUser(userId);
    if (user && user.isAdmin) {
      return true;
    }
    return false;
  }
}
