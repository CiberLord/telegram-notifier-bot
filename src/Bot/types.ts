import { type IUser } from '@src/Bot/models/user';
import { type IServiceConfig } from '@src/config/type';
import { type Telegraf, type Context, type Scenes } from 'telegraf';

export enum Role {
	NONE = 'NONE',
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export enum Events {
	SEND_EVENT = 'SEND_EVENT',
}

export interface IWizardEvent {
	id: number | string;
	title: string;
	date: string;
	time: string;
}

export interface WizardSession extends Scenes.WizardSessionData {
	event: IWizardEvent;
	deletedMessages: number[];
}

export interface IBot2ContextSession extends Scenes.WizardSession<WizardSession> {
	username: string;
	role: Role;
	utc: number;
}

export interface IBot2State {
	user: IUser;
}

export interface IBot2Context extends Context {
	session: IBot2ContextSession;
	state: IBot2State;
	scene: Scenes.SceneContextScene<IBot2Context, WizardSession>;
	wizard: Scenes.WizardContextWizard<IBot2Context>;
}

export interface IMiddleware {
	bot: Telegraf<IBot2Context>;
	config: IServiceConfig;
}
