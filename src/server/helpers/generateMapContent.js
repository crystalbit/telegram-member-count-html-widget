const database = require('../../common/database');
const { getColor } = require('./percentToColor');
const { setBounds, getProportion } = require('./normalize');


const generateMapContent = async () => {
    const max = await database.getMaxCount();
    const min = await database.getMinCount();
    setBounds(min.members, max.members);
    const getter = await database.get();
    let data = {};
    getter.forEach(item => {
        const codes = item.region.split(',');
        for (code of codes) {
            if (data[code]) {
                data[code].count = Math.max(data[code].count, item.members);
                data[code].color = data[code].count ? getColor(getProportion(data[code].count)) : '#bbbbbb';
            } else {
                data[code] = {
                    chats: [],
                    code,
                    count: item.members,
                    color: item.members ? getColor(getProportion(item.members)) : '#bbbbbb'
                };
            }
            data[code].chats.push({
                name: item.name,
                username: item.username,
                count: item.members || 'нет данных'
            });
        }
    });
    return Object.values(data);
}

module.exports = generateMapContent;
