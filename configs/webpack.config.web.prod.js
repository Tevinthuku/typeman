const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const baseConfig = require('./webpack.config.web.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '_redirects',
          to: path.join(__dirname, '../webdist/_redirects'),
          
        }
      ]
    })
  ]
});
