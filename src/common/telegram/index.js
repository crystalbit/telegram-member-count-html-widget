const Telegraf = require('telegraf');
const { telegram, admins } = require('../../config');
const Admin = require('./admin');
const { getCount } = require('./helpers/getCount');

let database;
const injectDatabase = _db => {
    database = _db;
    Admin.injectDatabase(_db);
}

const bot = new Telegraf(telegram.token);
bot.use(async ctx => {
    if (!ctx.update) return;
    // console.log(ctx.update)
    if (!ctx.update.message) return;
    const message = ctx.update.message;
    const from = message.from;
    if (!from) return;
    const chat = message.chat;
    if (!chat) return;

    if (message.new_chat_participant) {
        console.log('new member', from);
    }

    if (chat.type === 'group' || chat.type === 'supergroup') {
        if (!chat.username) return;
        const finder = await database.findOne(chat.username);
        if (!finder) {
            if (chat.username) {
                database.add({
                    name: chat.title,
                    username: chat.username,
                    id: chat.id
                });
            }
        }

        if (finder.name !== chat.title) {
            await database.updateName(chat.username, chat.title);
            await database.updateId(chat.username, chat.id);
            console.log([ finder.username, finder.name, chat.username, chat.title, await bot.telegram.getChatMembersCount(chat.id) ])
        }
        return;
    }

    // note: username can't start with a number, so no vulns here
    if (admins.includes(from.id) || admins.includes(from.username)) {
        if (message.text) Admin.parse(ctx, message.text); // need only if a text command
        return;
    }
});
bot.launch();

module.exports = {
    injectDatabase,
    getCount: getCount.bind(null, bot)
}
