
let database;
const injectDatabase = _db => database = _db;
let telegram;
const injectTelegram = _tg => telegram = _tg;

const updater = async () => {
    const chats = await database.get();
    for (const chat of chats) {
        try {
            const count = await telegram.getCount(chat.id);
            await database.updateCount(chat.username, count);
            console.log(chat.username, count);
        } catch (error) {
            console.log(chat, error.stack);
        }
        await new Promise(res => setTimeout(res, 5000));
    }
};

const start = async () => {
    await updater();
    console.log('wait for next trip...');
    setTimeout(start, 10 * 5000);
};

module.exports = {
    injectDatabase,
    injectTelegram,
    start
};
