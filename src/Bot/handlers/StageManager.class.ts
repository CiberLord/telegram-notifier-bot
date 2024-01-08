import { Handler } from '../Handler.abstract.class';
import { Scenes, type Telegraf } from 'telegraf';
import { type IBot2Context } from '@src/Bot/types';
import { type IServiceConfig } from '@src/config/type';
import { AddEventScene } from '../scenes/AddEventScene.class';
import { StartScene } from '@src/Bot/scenes/StartScene.class';

export class StageManagerHandler extends Handler {
	private readonly stage: Scenes.Stage<IBot2Context>;

	constructor(bot: Telegraf<IBot2Context>, config: IServiceConfig) {
		super(bot, config);

		const sceneOptions = {
			bot,
			config,
		};

		this.stage = new Scenes.Stage();

		this.stage.register(
			new StartScene(sceneOptions).getScene(),
			new AddEventScene(sceneOptions).getScene(),
		);
	}

	handle(): void {
		this.bot.use(this.stage.middleware());
	}
}
