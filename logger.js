const bunyan = require('bunyan');
const path = require('node:path');
const fs = require('node:fs');

const logsPath = path.resolve(process.cwd(), 'logs');

if (fs.existsSync(logsPath)) {
	fs.rmSync(logsPath, { recursive: true });
}

fs.mkdirSync(logsPath);

const debug = bunyan.createLogger({
	name: 'general',
	streams: [
		{
			level: 'debug',
			path: path.resolve(logsPath, 'debug.log'),
		},
	],
});

const error = bunyan.createLogger({
	name: 'general',
	streams: [
		{
			level: 'error',
			path: path.resolve(logsPath, 'error.log'),
		},
	],
});

console.log = function (...args) {
	debug.debug(...args);
};

console.error = function (...args) {
	error.error(...args);
};
