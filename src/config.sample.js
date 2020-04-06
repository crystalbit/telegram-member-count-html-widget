module.exports = {
    telegram: {
        token: '<bot token>'
    },
    mongo: {
        addr: 'mongodb+srv://<mongodb connection string>'
    },
    server: {
        route: '/covid-volunteers-map.js',
        port: 80,
        host: 'localhost'
    },
    yandex: {
        key: '<yandex maps api key>'
    },
    admins: [ 'dmitryq' ] // can be both ids and/or usernames
};
