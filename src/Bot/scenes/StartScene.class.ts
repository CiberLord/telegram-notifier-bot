import { Scenes, Markup, Composer } from 'telegraf';
import { BotWizardScene } from '../BotScene.abstract.class';
import { type IBotSceneConstrurctor } from '@src/Bot/BotScene.abstract.class';
import { type IBot2Context } from '@src/Bot/types';
import set from 'lodash/set';
import { SceneID } from './config';

const MOSCOW_UTC_CONVERTER = {
	'+0': 3,
	'-1': 2,
	'-2': 1,
	'+1': 4,
	'+2': 2,
};

export class StartScene extends BotWizardScene {
	wizard: Scenes.WizardScene<IBot2Context>;

	constructor(opt: Omit<IBotSceneConstrurctor, 'sceneId'>) {
		super({ ...opt, sceneId: SceneID.START });

		const buttonHandler = new Composer<IBot2Context>();

		for (const timezone of Object.keys(MOSCOW_UTC_CONVERTER)) {
			buttonHandler.action(timezone, async (ctx) => {
				const deletableMessages = ctx.session.__scenes?.deletedMessages ?? [];

				try {
					await Promise.all(deletableMessages.map(async (msgId) => {
						return ctx.deleteMessage(msgId);
					}));
				} catch (e) {
					//
				}

				// @ts-expect-error telegraf error
				const value = MOSCOW_UTC_CONVERTER[ctx.callbackQuery.data];

				ctx.session.utc = value;
			});
		}

		this.wizard = new Scenes.WizardScene(
			SceneID.START,
			async (ctx) => {
				const { message_id: messageId } = await ctx.reply('Укажи часовой пояс:', Markup.inlineKeyboard(
					Object.keys(MOSCOW_UTC_CONVERTER).map((value) => {
						return Markup.button.callback(`${value} от Мск`, value);
					}),
				));

				if (!ctx.session.__scenes?.deletedMessages) {
					set(ctx.session, '__scenes.deletedMessages', []);
				}

				ctx.session.__scenes?.deletedMessages?.push(messageId);

				return ctx.wizard.next();
			},
			buttonHandler,
		);
	}
}
