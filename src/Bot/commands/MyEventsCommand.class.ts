import { Command } from '@src/Bot/Command.abstract.class';
import { EventModel, type IEvent } from '../models/event';
import { UserModel } from '../models/user';
import dayjs from 'dayjs';
import { accessControl } from '../accessControl';

export class MyEventsCommand extends Command {
	handle(): void {
		const { bot } = this;

		bot.command('my_events', accessControl(), async (ctx) => {
			try {
				const events = await EventModel.find({ consumerId: ctx.state.user.chatId });

				if (events.length === 0) {
					return await ctx.reply('Нет запланированных событий');
				}

				const htmlItems = await Promise.all(events.map(async (event) => {
					return this.renderEvent(event);
				}));

				const html = htmlItems.join('\n\n');
				await ctx.reply('Все ваши события:');

				return await ctx.replyWithHTML(html);
			} catch (e) {
				console.error(e);

				return ctx.reply('Произошла какая-та ошибка(');
			}
		});
	}

	getData(): { command: string; description: string } {
		return {
			command: '/my_events',
			description: 'Мои события',
		};
	}

	private async renderEvent(event: IEvent) {
		const author = await UserModel.findOne({ chatId: event.authorId });
		const consumer = await UserModel.findOne({ chatId: event.consumerId });

		return `🟢Название: <b>${event.title}</b>\n\n🔹автор: <i>${author?.username ?? 'не указан'}</i>\n🔹подписчик: <i>${consumer?.username ?? 'не указан'}</i>\n🔹дата уведомления: <i>${dayjs(event.startTime).utcOffset(this.bot.context.session?.utc ?? 3).format('DD.MM.YYYY / время: HH:mm:ss')}</i>`;
	}
}
