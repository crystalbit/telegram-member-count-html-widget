const database = require('../../common/database');

const generateRegionsContent = async () => {
    const getter = await database.get();
    let data = {};
    getter.forEach(item => {
        const codes = item.region.split(',');
        for (code of codes) {
            if (!data[code]) {
                data[code] = {
                    chats: [],
                    code
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

const generateRegionsString = async () => {
    const items = await generateRegionsContent();
    let result = '<div class="reg-cont">';
    for (item of items) {
        result += `<div class="reg-item"><span>${item.code}</span><span>${item.code}</span></div>`;
    }
    result += `</div>`;
    return result;
}

module.exports = generateRegionsString;
