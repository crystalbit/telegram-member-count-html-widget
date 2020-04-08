// TODO do separate controllers
const express = require('express');
const morgan = require('morgan');
const { server, yandex } = require('../config');
const generateMapContent = require('./helpers/generateMapContent');
const generateRegions = require('./helpers/generateRegions');
const minifier = require('./helpers/minifier');

let cache = {
    map: null,
    regions: null
};

const app = express();

app.use(morgan('tiny'));
app.set('views', './src/server/views');
app.set('view engine', 'ejs');

app.get(server.routes.jsmap, async (req, res) => {
    const referer = req.headers.referer;
    if (!referer.startsWith(server.referer)) {
        return res.send(`console.log('https://github.com/crystalbit/telegram-member-count-html-widget')`);
    }
    if (cache.map) {
        res.send(cache.map);
    } else {
        const items = await generateMapContent();
        res.render('jsonp', { items, cached: new Date }, async (err, code) => {
            if (err) {
                res.type('text/javascript').send('console.log(`Error ' + err + '`);');
            } else {
                const minified = await minifier(code);
                cache.map = minified;
                setTimeout(() => cache.map = null, 5 * 60 * 1000);
                res.type('text/javascript').send(minified);
            }
        });
    }
});

app.get(server.routes.jsregions, async (req, res) => {
    if (cache.regions) {
        res.send(cache.regions);
    } else {
        const data = await generateRegions();
        res.render('regions', { data, cached: new Date }, async (err, code) => {
            if (err) {
                res.type('text/javascript').send('console.log(`Error ' + err + '`);');
            } else {
                const minified = await minifier(code);
                cache.regions = minified;
                setTimeout(() => cache.regions = null, 5 * 60 * 1000);
                res.type('text/javascript').send(minified);
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
