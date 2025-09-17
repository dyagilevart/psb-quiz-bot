

import { Scene, SceneEnter, SceneLeave, Command, Action, Ctx, On, Hears, Message } from 'nestjs-telegraf';
import { TelegrafContext } from 'src/common/interfaces/telegraf-context.interface';
import { SceneEnum } from '../../types/scene.enum';
import { AppointmentService } from './appointment.service';


@Scene(SceneEnum.APPOINTMENT)
export class AppointmentScene {
    constructor(private _appointmentService: AppointmentService) { }

    @SceneEnter()
    onSceneEnter(ctx: TelegrafContext) {
        return this._appointmentService.showCalendar(ctx);
    }

    @SceneLeave()
    onSceneLeave(): string {
        console.log('Leave from scene');
        return 'Bye Bye 👋';
    }

    @On('callback_query')
    async onCallback(ctx: TelegrafContext) {
        return this._appointmentService.onCallback(ctx);
    }

    @Command('leave')
    async onLeaveCommand(ctx: TelegrafContext): Promise<void> {
        await ctx.scene.leave();
    }
}