const express = require('express');
const morgan = require('morgan');
const { server } = require('../config');
const database = require('../common/database');
const { setBounds, getProportion } = require('./helpers/normalize');
const { getColor } = require('./helpers/percentToColor');

const app = express();

app.use(morgan('tiny'));
app.set('views', './src/server/views');
app.set('view engine', 'ejs');

app.get(server.route, async (req, res) => {
    const max = await database.getMaxCount();
    const min = await database.getMinCount();
    setBounds(min.members, max.members);
    const getter = await database.get();
    //console.log(getter);
    const mapped = getter
        .filter(item => item.region && item.members)
        .map(item => ({ codes: item.region.split(','), color: getColor(getProportion(item.members)) }));
    res.render('jsonp', {
        items: mapped
    });
});

app.listen(server.port, () => console.log('listening on ' + server.port));
