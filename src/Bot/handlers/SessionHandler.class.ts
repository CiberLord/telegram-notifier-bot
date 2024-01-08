import { Handler } from '../Handler.abstract.class';
import { type Telegraf } from 'telegraf';
import { type IBot2ContextSession, type IBot2Context } from '@src/Bot/types';
import { type IServiceConfig } from '@src/config/type';
import TelegrafLocalSession from 'telegraf-session-local';
import os from 'node:os';
import path from 'node:path';
import { config } from '@src/config';

const SESSION_DB_FILE = path.resolve(os.homedir(), config.get('TG_BOT_SESSION_FILE'));

export class SessionHandler extends Handler {
	private readonly session: TelegrafLocalSession<IBot2ContextSession>;

	constructor(bot: Telegraf<IBot2Context>, config: IServiceConfig) {
		super(bot, config);

		this.session = new TelegrafLocalSession({ database: SESSION_DB_FILE });
	}

	handle(): void {
		this.bot.use(this.session.middleware());
	}
}
