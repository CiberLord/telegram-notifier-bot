import { Role } from './types';
import { type Context } from 'telegraf';

export const accessControl = (accessRoles?: Role[]) => {
	return async (context: Pick<Context, 'state' | 'reply'>, next: () => Promise<void>) => {
		const userRole = context.state.user.role;

		if (accessRoles) {
			if (accessRoles.includes(userRole)) {
				return next();
			}
		} else if (userRole !== Role.NONE) {
			return next();
		}

		return context.reply('У вас недостаточно прав для выполнения этой команды');
	};
};
