import { Schema, model, type Types } from 'mongoose';
import { Role } from '../types';

export interface IUser {
	_id: Types.ObjectId;
	chatId: number;
	username: string;
	role: Role;
}

const UserSchema = new Schema<IUser>({
	_id: Schema.Types.ObjectId,
	chatId: Number,
	username: String,
	role: {
		type: String,
		enum: Object.values(Role),
		default: Role.NONE,
	},
});

export const UserModel = model<IUser>('User', UserSchema);
