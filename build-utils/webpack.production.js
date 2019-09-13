const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
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