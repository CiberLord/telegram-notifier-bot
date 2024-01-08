import { Command } from '../Command.abstract.class';
import { accessControl } from '../accessControl';
import { SceneID } from '../scenes/config';

export class StartCommand extends Command {
	handle(): void {
		this.bot.command('start', async (ctx, next) => {
			await ctx.reply('Привет! Это бот для создания уведомлений');

			return next();
		}, accessControl(), async (ctx) => {
			return ctx.scene.enter(SceneID.START);
		});
	}

	getData(): { command: string; description: string } {
		return {
			command: '/start',
			description: 'Старт',
		};
	}
}
