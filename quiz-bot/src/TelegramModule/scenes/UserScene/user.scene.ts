

import { Scene, SceneEnter, SceneLeave, Command, Action, Ctx, On, Hears } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { SceneEnum } from '../../types/scene.enum';
import { HelloController } from './controller/hello.controller';


@Scene(SceneEnum.USER_CONSOLE)
export class UserScene {
    @SceneEnter()
    onSceneEnter(ctx: TelegrafContext) {
        return HelloController(ctx);
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