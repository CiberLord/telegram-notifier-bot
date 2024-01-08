import { Types } from 'mongoose';
import { Handler } from '../Handler.abstract.class';
import { UserModel } from '../models/user';

export class UserHandler extends Handler {
	handle(): void {
		this.bot.use(async (ctx, next) => {
			const chatId = ctx.chat?.id;

			let user = await UserModel.findOne({ chatId });

			if (!user) {
				user = await UserModel.create({
					chatId: ctx.chat?.id,
					_id: new Types.ObjectId(),
					username: ctx.from?.username,
				});
			}

			ctx.state.user = user;

			return next();
		});
	}
}
