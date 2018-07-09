const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                }))
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ],
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 9000
    }
};
