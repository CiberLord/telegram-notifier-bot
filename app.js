require('./logger');
require('dotenv').config();
const { startApplication } = require('./dist/src/index.js');

startApplication();
