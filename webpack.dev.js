const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
        historyApiFallback: true,
        contentBase: './dist',
        host: '10.30.90.114',
        https: true,
        compress: true,
        port: 9000,
    },
});
