import {
  Scene,
  SceneEnter,
  SceneLeave,
  Command,
  Action,
  Ctx,
  On,
  Hears,
  Sender,
} from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { SceneEnum } from '../../types/scene.enum';
import { HelloController } from './controller/hello.controller';
import { UserService } from './user.service';

@Scene(SceneEnum.USER_CONSOLE)
export class UserScene {
  constructor(private _userService: UserService) {}

  @SceneEnter()
  onSceneEnter(ctx: TelegrafContext) {
    return HelloController(ctx);
  }

  @On('callback_query')
  onCallback(@Sender('id') id: number, @Ctx() ctx: TelegrafContext) {
    this._userService.workWithAnswer(id, ctx);
  }

  @SceneLeave()
  onSceneLeave() {
    console.log('Leave from scene');
  }

  @Command('leave')
  async onLeaveCommand(ctx: TelegrafContext): Promise<void> {
    await ctx.scene.leave();
  }
}
