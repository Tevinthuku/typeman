const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.web.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    port: 4000,
    historyApiFallback: true
  }
});
