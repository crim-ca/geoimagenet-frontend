const config = require('./webpack-common.config');

config.mode = 'development';
config.devtool = 'eval-source-map';

module.exports = config;
