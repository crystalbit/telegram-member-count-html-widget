const database = require('../common/database');
const telegram = require('../common/telegram');
telegram.injectDatabase(database);
const Timer = require('./timer');

Timer.injectDatabase(database);
Timer.injectTelegram(telegram);

Timer.start(); // async
