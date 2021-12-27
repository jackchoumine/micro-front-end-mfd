const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const packageJson = require('../package.json')
const commonConfig = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/dashboard/latest/',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardApp': './src/bootstrap',
      },
      shared: packageJson.dependencies,
    }),
    new CleanWebpackPlugin(),
    // new ProgressBarWebpackPlugin(),
  ],
  stats: {
    colors: true,
    assetsSort: 'size',
    chunksSort: '!size',
    groupReasonsByOrigin: true,
    builtAt: true,
    colors: true,
    depth: false,
  },
}

module.exports = merge(commonConfig, prodConfig)
