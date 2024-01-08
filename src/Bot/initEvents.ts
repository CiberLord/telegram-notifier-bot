import { type TaskScheduler } from '@src/TaskScheduler.abstact.class';
import { config } from '@src/config';
import { Events, type IBot2Context } from './types';
import { EventModel } from './models/event';
import { type Telegraf } from 'telegraf';

export const initEvents = (bot: Telegraf<IBot2Context>) => {
	const scheduler = config.get<TaskScheduler>('scheduler');

	scheduler.on<{ eventId: string }>(Events.SEND_EVENT, async (job) => {
		try {
			console.log('job running');
			console.log(job);

			const event = await EventModel.findOneAndDelete({ _id: job?.attrs?.data?.eventId });

			if (!event || !event?.title) {
				console.log('Cannot find event by id');
				return;
			}

			console.log('event send');

			await bot.telegram.sendMessage(event.consumerId, `🔔 ${event.title}`);
		} catch (e) {
			console.log('Some rror when send event');
			console.log(e);
		}
	});
};
