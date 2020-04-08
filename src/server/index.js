const express = require('express');
const morgan = require('morgan');
const { server, yandex } = require('../config');
const generateMapContent = require('./helpers/generateMapContent');

let cache = null;

const app = express();

app.use(morgan('tiny'));
app.set('views', './src/server/views');
app.set('view engine', 'ejs');

app.get(server.routes.jsmap, async (req, res) => {
    const referer = req.headers.referer;
    if (!referer.startsWith(server.referer)) {
        return res.send(`console.log('https://github.com/crystalbit/telegram-member-count-html-widget')`);
    }
    if (cache) {
        res.send(cache);
    } else {
        const data = await generateMapContent();
        res.render('jsonp', { items: Object.values(data), cached: new Date }, async (err, code) => {
            if (err) {
                res.send('console.log(`Error ' + err + '`);');
            } else {
                const minified = minifier(code);
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
    const data = await generateMapContent();
    res.render('index', {
        items: Object.values(data),
        key: yandex.key,
        cached: new Date
    });
});

app.listen(server.port, () => console.log('listening on ' + server.port));
