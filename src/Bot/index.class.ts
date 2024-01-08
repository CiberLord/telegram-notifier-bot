import { type IServiceConfig } from '@src/config/type';
import { Telegraf } from 'telegraf';
import { type IBot2Context } from '@src/Bot/types';
import { type Command } from './Command.abstract.class';
import { StartCommand } from './commands/StartCommand.class';
import { AddEventCommand } from './commands/AddEventCommand.class';
import { UserHandler } from './handlers/UserHandler.class';
import { type Handler } from './Handler.abstract.class';
import { StageManagerHandler } from './handlers/StageManager.class';
import { SessionHandler } from './handlers/SessionHandler.class';
import { MyEventsCommand } from './commands/MyEventsCommand.class';
import { initEvents } from './initEvents';

export class Bot2 {
	private readonly config: IServiceConfig;
	private readonly bot: Telegraf<IBot2Context>;
	private readonly commands: Command[];
	private readonly handlers: Handler[];

	constructor(config: IServiceConfig) {
		this.config = config;
		this.bot = new Telegraf(config.get<string>('BOT_TOKEN'));

		this.handlers = [
			new SessionHandler(this.bot, this.config),
			new UserHandler(this.bot, this.config),
			new StageManagerHandler(this.bot, this.config),
		];

		this.commands = [
			new StartCommand(this.bot),
			new AddEventCommand(this.bot),
			new MyEventsCommand(this.bot),
		];
	}

	async init() {
		// Init events
		initEvents(this.bot);

		// Send commands
		await this.bot.telegram.setMyCommands(this.commands.map((cmd) => {
			return cmd.getData();
		}));

		// Init handlers
		for (const handler of this.handlers) {
			handler.handle();
		}

		// Handle commands
		for (const command of this.commands) {
			command.handle();
		}
	}

	async launch() {
		await this.bot.launch();

		console.log('Bot is running...');
	}

	stop() {
		this.bot.stop();
	}
}
