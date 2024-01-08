import { type Telegraf } from 'telegraf';
import { type IBot2Context } from './types';
import { type IServiceConfig } from '@src/config/type';

export abstract class Handler {
	protected readonly bot: Telegraf<IBot2Context>;
	protected readonly config: IServiceConfig;

	constructor(bot: Telegraf<IBot2Context>, config: IServiceConfig) {
		this.bot = bot;
		this.config = config;
	}

	abstract handle(): void;
}
