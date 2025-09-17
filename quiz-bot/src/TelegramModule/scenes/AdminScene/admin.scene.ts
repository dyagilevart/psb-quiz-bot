import {
  Scene,
  SceneEnter,
  SceneLeave,
  Command,
  Hears,
  On,
} from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { SceneEnum } from '../../types/scene.enum';
import { AdminService } from './admin.service';

@Scene(SceneEnum.ADMIN_CONSOLE)
export class AdminScene {
  constructor(private _adminService: AdminService) {}

  @SceneEnter()
  onSceneEnter(ctx: TelegrafContext) {
    this._adminService.welcomeAdmin(ctx);
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log('Leave from scene');
    return 'Bye Bye 👋';
  }

  @On('callback_query')
  onCreateASchedule(): number {
    return Math.floor(Math.random() * 11);
  }

  @Command('leave')
  async onLeaveCommand(ctx: TelegrafContext): Promise<void> {
    await ctx.scene.leave();
  }
}
