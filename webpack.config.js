const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = ({ mode }) => {
    console.log("MODE", mode);

    return {
        //mode : "none | development | production"
        mode,
        entry : './src/index.js',
        output : {
            filename : 'bundle.js',

        },
        plugins : [ new HtmlWebpackPlugin(), new webpack.ProgressPlugin(),]

    }
}