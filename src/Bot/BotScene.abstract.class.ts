import { type Scenes, type Telegraf } from 'telegraf';
import { type IBot2Context } from './types';
import { type IServiceConfig } from '@src/config/type';

export interface IBotSceneConstrurctor {
	bot: Telegraf<IBot2Context>;
	config: IServiceConfig;
	sceneId: string;
}

export abstract class BotWizardScene {
	private static instance: undefined | BotWizardScene;

	abstract wizard: Scenes.WizardScene<IBot2Context>;

	protected bot!: Telegraf<IBot2Context>;
	protected config!: IServiceConfig;
	protected sceneId!: string;

	constructor({ bot, config, sceneId }: IBotSceneConstrurctor) {
		if (BotWizardScene.instance) {
			return BotWizardScene.instance;
		}

		this.bot = bot;
		this.config = config;
		this.sceneId = sceneId;

		BotWizardScene.instance = this;
	}

	public async enter(ctx: IBot2Context) {
		return ctx.scene.enter(this.sceneId);
	}

	public async leave(ctx: IBot2Context) {
		return ctx.scene.leave();
	}

	public getScene() {
		return this.wizard;
	}

	public getId() {
		return this.sceneId;
	}
}
