const minify = require('@node-minify/core');
const uglifyJS = require('@node-minify/uglify-js');

const minifier = async code => {
    let minified;
    try {
        minified = await minify({
            compressor: uglifyJS,
            content: code
        });
    } catch (err) {
        minified = code;
    }
    return minified;
};

module.exports = minifier;
