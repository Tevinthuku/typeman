const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.web.base');

module.exports = merge(baseConfig, {
  mode: 'production'
});
