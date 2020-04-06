const express = require('express');
const minify = require('@node-minify/core');
const uglifyJS = require('@node-minify/uglify-js');
const morgan = require('morgan');
const { server, yandex } = require('../config');
const database = require('../common/database');
const { setBounds, getProportion } = require('./helpers/normalize');
const { getColor } = require('./helpers/percentToColor');

let cache = null;

const app = express();

app.use(morgan('tiny'));
app.set('views', './src/server/views');
app.set('view engine', 'ejs');

app.get(server.route, async (req, res) => {
    const host = req.headers.host;
    if (!host.startsWith(server.host)) {
        return res.send(`console.log('https://github.com/crystalbit/telegram-member-count-html-widget')`);
    }
    if (cache) {
        res.send(cache);
    } else {
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
        res.render('jsonp', { items: Object.values(data), cached: new Date }, async (err, code) => {
            if (err) {
                res.send('console.log(`Error ' + err + '`);');
            } else {
                let minified;
                try {
                    minified = await minify({
                        compressor: uglifyJS,
                        content: code
                    });
                } catch (err) {
                    minified = code;
                }
                cache = minified;
                setTimeout(() => cache = null, 5 * 60 * 1000);
                res.send(minified);
            }
        });
    }
});

app.get('/', async (req, res) => {
    const host = req.headers.host;
    if (!host.startsWith('localhost')) return res.send('https://github.com/crystalbit/telegram-member-count-html-widget');
    // TODO duplicationg code
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
    })
    res.render('index', {
        items: Object.values(data),
        key: yandex.key,
        cached: new Date
    });
});

app.listen(server.port, () => console.log('listening on ' + server.port));
