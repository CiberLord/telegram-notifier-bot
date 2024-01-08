import { type Telegraf } from 'telegraf';
import { type IBot2Context } from './types';

export abstract class Command {
	protected readonly bot: Telegraf<IBot2Context>;

	constructor(bot: Telegraf<IBot2Context>) {
		this.bot = bot;
	}

	abstract handle(): void;

	abstract getData(): { command: string; description: string };
}
