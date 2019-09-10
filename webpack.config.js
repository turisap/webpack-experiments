const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const webpackMerge = require('webpack-merge');

module.exports = ({ mode, presets } = { mode : 'production', presets : []})  => {
    console.log("MODE", mode);

    return webpackMerge(
        {
            //mode : "none | development | production"
            mode,
            entry : './src/index.js',
            output : {
                filename : 'bundle.js',

            },
            plugins : [ new HtmlWebpackPlugin(), new webpack.ProgressPlugin(),]

        },
        modeConfig(mode)
    );
}