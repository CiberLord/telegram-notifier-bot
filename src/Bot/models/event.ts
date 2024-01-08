import { Schema, model } from 'mongoose';

export interface IEvent {
	username?: string;
	authorId: number;
	consumerId: number;
	title: string;
	startTime: string;
}

const EventSchema = new Schema<IEvent>({
	username: String,
	authorId: Number,
	consumerId: Number,
	title: String,
	startTime: String,
});

export const EventModel = model<IEvent>('Event', EventSchema);
