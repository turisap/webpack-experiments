const webpackBunldeAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// creates a map of sizes dependencies in bundle
module.exports = () => ({
    plugins : [
        new webpackBunldeAnalyzer()
    ]
});