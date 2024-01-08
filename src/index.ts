
import { Bot2 } from '@src/Bot/index.class';
import { config } from '@src/config';
import mongoose from 'mongoose';
import Agenda from 'agenda';
import { AgendaTaskScheduler } from '@src/AgendaTaskScheduler.class';
import os from 'node:os';
import path from 'node:path';

const DB_CA_FILE = path.resolve(os.homedir(), '.mongodb/root.crt');

const DB_URL = config.get<string>('MONGO_DB_URL');

const DB_OPTIONS = {
	tls: true,
	tlsCAFile: DB_CA_FILE,
};

export const startApplication = async () => {
	let bot;

	try {
		await mongoose.connect(DB_URL, DB_OPTIONS);

		console.log('db was conntected!');

		const agenda = new Agenda({
			db: {
				address: DB_URL,
				options: DB_OPTIONS,
			},
		});

		agenda.on('ready', () => {
			console.log('Agenda client was connected!');
		});

		const taskScheduler = new AgendaTaskScheduler(agenda);

		config.set('scheduler', taskScheduler);

		bot = new Bot2(config);

		await agenda.start();
		await bot.init();

		await bot.launch();
	} catch (e) {
		bot?.stop();

		console.log(e);
	}
};
