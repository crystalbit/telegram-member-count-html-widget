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
    if (!ctx.update.message && !ctx.update.edited_message) console.log(ctx.update)
    if (!ctx.update.message && !ctx.update.edited_message) return;
    const message = ctx.update.message || ctx.update.edited_message;
    const from = message.from;
    // if (!from) console.log(message)
    if (!from) return;
    const chat = message.chat;
    // if (!chat) console.log(message)
    if (!chat) return;

    // if (message.new_chat_participant) {
    //     console.log('new member', from);
    // }

    if (chat.type === 'group' || chat.type === 'supergroup') {
        if (!chat.username) return;
        const finder = await database.findOne(chat.username);
        if (!finder) {
            // new group
            const finderById = await database.findOneById(chat.id);
            if (finderById) {
                // username changed
                await database.updateById(chat.id, { username: chat.username.toLowerCase() });
            } else if (chat.username) {
                // absolutely new
                database.add({
                    name: chat.title,
                    username: chat.username,
                    id: chat.id
                });
            }
        }

        if (finder && finder.name !== chat.title) {
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
