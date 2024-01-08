import { type IJob, TaskScheduler } from '@src/TaskScheduler.abstact.class';

export class AgendaTaskScheduler extends TaskScheduler {
	on<T = any>(eventId: string, handler: (job: IJob<T>) => unknown) {
		this.agenda.define(eventId, handler);
	}

	async dispatch<T>(time: string, eventId: string, payload?: T | undefined) {
		// @ts-expect-error agenda error
		await this.agenda.schedule(time, eventId, payload);
	}
}
