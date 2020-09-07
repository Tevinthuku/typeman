const merge = require('webpack-merge');
const { GenerateSW } = require('workbox-webpack-plugin');

const baseConfig = require('./webpack.config.web.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [new GenerateSW()]
});
