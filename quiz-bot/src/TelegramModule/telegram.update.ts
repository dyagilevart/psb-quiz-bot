import { Ctx, Start, Update, Sender, On, Message } from 'nestjs-telegraf';

import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { RegistrationService } from 'src/BusinessModule/RegistrationModule/registration.service';
import { SceneEnum } from './types/scene.enum';
import { AdminService } from 'src/BusinessModule/AdminModule/admin.service';

@Update()
export class TelegramUpdate {
  constructor(
    private registrationService: RegistrationService,
    private adminService: AdminService,
  ) {}

  @Start()
  async onStart(@Sender('id') id: number, @Ctx() ctx: TelegrafContext) {
    if (!(await this.registrationService.isUserAlreadyRegistered(id))) {
      await this.registrationService.register({
        id,
        chatId: ctx.chat?.id || 0,
      });
    }

    if (await this.adminService.isAdmin(id)) {
      ctx.scene.enter(SceneEnum.ADMIN_CONSOLE);
    } else {
      ctx.scene.enter(SceneEnum.USER_CONSOLE);
    }
  }

  @On('callback_query')
  async onCallback(@Sender('id') id: number, @Ctx() ctx: TelegrafContext) {
    if (await this.adminService.isAdmin(id)) {
      ctx.scene.enter(SceneEnum.ADMIN_CONSOLE);
    } else {
      ctx.scene.enter(SceneEnum.USER_CONSOLE);
    }
  }
}
