import { Context, Scenes } from 'telegraf';
import { Update } from '@telegraf/types';

interface TelegramSession extends Scenes.SceneSessionData {
  isAdmin: boolean;
}

interface TelegramContext extends Context<Update> {
  session: TelegramSession & Scenes.SceneSession<TelegramSession>;
  scene: Scenes.SceneContextScene<TelegramContext, TelegramSession>;
}

export { TelegramContext, TelegramSession };
