const getCount = (bot, id) => {
    return bot.telegram.getChatMembersCount(id);
};

module.exports = {
    getCount
};