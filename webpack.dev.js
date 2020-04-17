const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

// If working in a VM with a static IP (say, in bridged mode), replace with the specific IP
// This needs to be the IP of the host the frontend will be launched from.
const baseUrl = '127.0.0.1';

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
    host: baseUrl,
    https: false,
    compress: true,
    port: 9000,
  },
});
