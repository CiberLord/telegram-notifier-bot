import { Command } from '@src/Bot/Command.abstract.class';
import { SceneID } from '@src/Bot/scenes/config';
import { accessControl } from '@src/Bot/accessControl';

export class AddEventCommand extends Command {
	handle(): void {
		this.bot.command('add_event', accessControl(), async (ctx) => {
			return ctx.scene.enter(SceneID.ADD_EVENT);
		});
	}

	getData(): { command: string; description: string } {
		return {
			command: '/add_event',
			description: 'Добавить событие',
		};
	}
}
