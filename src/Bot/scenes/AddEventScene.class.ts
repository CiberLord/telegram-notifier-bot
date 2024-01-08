import { Scenes, Markup, Composer } from 'telegraf';
import { BotWizardScene } from '../BotScene.abstract.class';
import { type IBotSceneConstrurctor } from '@src/Bot/BotScene.abstract.class';
import { Events, type IBot2Context, type WizardSession } from '@src/Bot/types';
import set from 'lodash/set';
import { SceneID } from './config';
import dayjs from '@src/dayjs';
import { EventModel, type IEvent } from '../models/event';
import { type TaskScheduler } from '@src/TaskScheduler.abstact.class';

const TIME_FORMAT = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const DATE_FORMAT = /^(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)$/;
const MAX_MESSAGE_CHAR_SIZE = 120;

class CreateEventError extends Error {
	private readonly description?: string;
	private readonly code: string;
	private readonly payload: any;

	constructor(code: string, message?: string, payload?: any) {
		super(message);

		this.code = code;
		this.description = message;
	}

	public getText() {
		return this.description;
	}

	public getCode() {
		return this.code;
	}

	public getPayload<T>(): T {
		return this.payload;
	}
}

export class AddEventScene extends BotWizardScene {
	wizard: Scenes.WizardScene<IBot2Context>;

	constructor(opt: Omit<IBotSceneConstrurctor, 'sceneId'>) {
		super({ ...opt, sceneId: SceneID.ADD_EVENT });

		const stepHandler = new Composer<IBot2Context>();

		stepHandler.action('cancelEvent', async (ctx) => {
			await ctx.reply('Вы отменили событие!');

			return ctx.scene.leave();
		});
		stepHandler.action('saveEvent', async (ctx) => {
			try {
				const deletableMessages = ctx.session.__scenes?.deletedMessages ?? [];

				try {
					await Promise.all(deletableMessages.map(async (msgId) => {
						return ctx.deleteMessage(msgId);
					}));
				} catch (e) {
					console.error('Delete message error');
				}

				const event = this.createEvent(ctx as unknown as IBot2Context);

				const scheduler = this.config.get<TaskScheduler>('scheduler');

				const result = await EventModel.create(event);

				await scheduler.dispatch(event.startTime, Events.SEND_EVENT, {
					eventId: result._id.toString(),
				});

				await ctx.reply('Отлично! Запись сделана');
			} catch (error) {
				if (error instanceof CreateEventError) {
					if (error.getCode() === 'INVALID_DATE') {
						await ctx.reply('Нельзя указать дату в прошлом!');
						await ctx.reply('Укажите дату (в формате: ГГГГ-MM-ДД):');

						ctx.wizard.back();
						ctx.wizard.back();

						return;
					}
				}

				console.error(error);
				await ctx.reply('Оопс! Что-то пошло не так. Поробуйте заново');
			}

			return ctx.scene.leave();
		});

		this.wizard = new Scenes.WizardScene(
			SceneID.ADD_EVENT,
			async (ctx) => {
				ctx.session.__scenes = this.createSessionScenes(ctx);

				await ctx.reply(`Напишите событие (Не более ${MAX_MESSAGE_CHAR_SIZE} символов):`);

				ctx.wizard.next();
			},
			async (ctx) => {
				// @ts-expect-error errro
				const text = ctx.message?.text as string;
				if (!text) {
					return ctx.reply('Пожалуйста, введите текст:');
				}

				if (text.length > MAX_MESSAGE_CHAR_SIZE) {
					return ctx.reply(`Нельзя указать больше ${MAX_MESSAGE_CHAR_SIZE} символов. Уменьшите размер сообщения:`);
				}

				set(ctx.session, '__scenes.event.title', text);

				await ctx.reply('Укажите дату(в формате: ГГГГ-MM-ДД):');

				return ctx.wizard.next();
			},
			async (ctx) => {
				// @ts-expect-error error
				const dateText = ctx.message.text;

				const isValid = DATE_FORMAT.test(dateText);

				if (!isValid) {
					await ctx.reply('Не корректно ввели дату, повторите:');

					return;
				}

				set(ctx.session, '__scenes.event.date', dateText);

				await ctx.reply('Укажите время в формате ЧЧ:MM');

				return ctx.wizard.next();
			},
			async (ctx) => {
				// @ts-expect-error errro
				const timeText = ctx.message.text;

				const isValid = TIME_FORMAT.test(timeText);
				if (!isValid) {
					await ctx.reply('Не корректно ввели время, повторите:');

					return;
				}

				set(ctx.session, '__scenes.event.time', timeText);

				const { message_id: messageId } = await ctx.reply('Выберите действие:', Markup.inlineKeyboard([
					Markup.button.callback('Отменить', 'cancelEvent'),
					Markup.button.callback('Сохранить', 'saveEvent'),
				]));

				if (!ctx.session.__scenes?.deletedMessages) {
					set(ctx.session, '__scenes.deletedMessages', []);
				}

				ctx.session.__scenes?.deletedMessages?.push(messageId);

				return ctx.wizard.next();
			},
			stepHandler,
		);
	}

	public createEvent = (ctx: IBot2Context): IEvent => {
		const scenes = ctx.session.__scenes;

		if (!scenes) {
			throw new CreateEventError('NULL_SCENE_DATA', 'Не найдены данные события:(');
		}

		const eventDate = dayjs(`${scenes.event.date}T${scenes.event.time}:00+0${ctx.session.utc}:00`, 'YYYY-MM-DDTHH:mm:ssZ').utc();
		const currentDate = dayjs().utc();
		const diff = eventDate.diff(currentDate);
		if (diff < 0) {
			throw new CreateEventError('INVALID_DATE', undefined, diff);
		}

		return {
			title: scenes.event.title,
			startTime: eventDate.format(),
			authorId: ctx.state.user.chatId,
			consumerId: ctx.state.user.chatId,
		};
	};

	private readonly createSessionScenes = (ctx: IBot2Context): WizardSession => {
		const { __scenes } = ctx.session;

		const event = {
			id: new Date().getTime(),
			title: '',
			date: '',
			time: '',
		};

		if (__scenes) {
			return {
				...__scenes,
				event,
			};
		}

		return {
			current: 'ADD_EVENT',
			state: {},
			deletedMessages: [],
			cursor: 1,
			event,
		};
	};
}
