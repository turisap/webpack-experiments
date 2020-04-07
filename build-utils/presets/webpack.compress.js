const webpackCompressionPlugin = require('compression-webpack-plugin');

module.exports = () => ({
    plugins: [new webpackCompressionPlugin()]
})