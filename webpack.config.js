const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const modeConfig = mode => require(`./build-utils/webpack.${mode}`)(mode);
const webpackMerge = require('webpack-merge');
const presetConfig = require('./build-utils/loadPresets');

module.exports = ({ mode, presets } = { mode : 'production', presets : []})  => {
    // console.log("MODE", mode);
    // console.log("PRESETS",presets)

    return webpackMerge(
        {
            //mode : "none | development | production"
            mode,
            entry : './src/index.js',
            output : {
                filename : 'bundle.js',

            },
            module : {
              rules : [
                  {
                      test: /\.jpe?g$/,
                      use : [{
                          loader : 'url-loader',
                          options : {
                              limit : 5000
                          }
                      }]
                  }
              ]
            },
            plugins : [ new HtmlWebpackPlugin(), new webpack.ProgressPlugin(),]

        },
        modeConfig(mode),
        presets ? presetConfig({ mode, presets}) : null,
    );
}