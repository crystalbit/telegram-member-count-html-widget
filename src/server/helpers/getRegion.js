const countries = require('iso3166-2-db/countryList/dispute/RU/ru');
const ruRegions = require('iso3166-2-db/regions/RU/dispute/RU/ru');
const uaRegions = require('iso3166-2-db/regions/UA/dispute/RU/ru');

const getRegion = code => {
    if (countries[code]) return countries[code].name;
    const pair = code.split('-');
    if (pair.length < 2 || !['RU', 'UA'].includes(pair[0])) return 'Неизвестный регион';
    if (pair[0] === 'RU' && ruRegions.find(it => it.iso === pair[1])) {
        return ruRegions.find(it => it.iso === pair[1]).name;
    }
    if (pair[0] === 'UA' && uaRegions.find(it => it.iso === pair[1])) {
        return uaRegions.find(it => it.iso === pair[1]).name;
    }
    return 'Неизвестный регион';
}

module.exports = getRegion;
