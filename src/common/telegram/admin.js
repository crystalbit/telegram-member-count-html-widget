
let database;
const injectDatabase = _db => database = _db;

const help = `
commands:
/add channel_username region
`.trim();

const parse = async (ctx, text) => {
    const parameters = text.split(' ');
    if (parameters[0].length < 3) return ctx.reply('bad command');
    if (['/start', '/help'].includes(parameters[0])) {
        ctx.reply(help);
    } else if (parameters[0] === '/add') {
        if (parameters.length < 3) return ctx.reply('not enough parameters');
        try {
            const adder = await database.add({
                username: parameters[1],
                region: parameters[2],
                date: Date.now(),
                members: 0,
                name: ''
            });
            ctx.reply('added ' + JSON.stringify(adder));
        } catch (error) {
            ctx.reply(error.stack);
        }
    } else return ctx.reply('bad command');
    console.log(text);
};

module.exports = {
    injectDatabase,
    parse
};
