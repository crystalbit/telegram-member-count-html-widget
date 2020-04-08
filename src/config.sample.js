module.exports = {
    telegram: {
        token: '<bot token>'
    },
    mongo: {
        addr: 'mongodb+srv://<mongodb connection string>'
    },
    server: {
        routes: {
            jsmap: '/covid-volunteers-map.js',
            jsregions: '/regions.js'
        },
        port: 80,
        referer: 'localhost'
    },
    yandex: {
        key: '<yandex maps api key>'
    },
    admins: [ 'dmitryq' ] // can be both ids and/or usernames
};
