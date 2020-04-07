const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
    devtool: "nosource-source-map",
    plugins: [
        new MiniCssExtractPlugin({}),
    ],
    module : {
        rules : [
            {
                test: /\.css/,
                use : [MiniCssExtractPlugin.loader, 'css-loader']
            },
        ]

    },
    output : {
        // hashed filename, only for production
        filename : '[chunkhash].js',
    },
});