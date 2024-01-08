import type Agenda from 'agenda';

export interface IJob<T> {
	attrs: {
		data: T;
	};
}

abstract class TaskScheduler {
	protected agenda: Agenda;

	constructor(agenda: Agenda) {
		this.agenda = agenda;
	}

	abstract on<T = any>(eventId: string, handler: (job: IJob<T>) => unknown): unknown;

	abstract dispatch<T>(time: string, eventId: string, payload?: T): Promise<unknown>;
}

export { TaskScheduler };
