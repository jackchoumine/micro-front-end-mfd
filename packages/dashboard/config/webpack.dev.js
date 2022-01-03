const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common')
const packageJson = require('../package.json')

const devConfig = {
  mode: 'development',
  // output: {
  //   publicPath: 'http://localhost:8083/',
  // },
  devServer: {
    port: 8083,
    // FIXME 解决刷新页面，空白的问题
    // https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
    historyApiFallback: true,
    // historyApiFallback: {
    //   index: 'index.html',
    // },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
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
  ],
  // stats: 'error-only', // 开发环境下不显示日志
}

module.exports = merge(commonConfig, devConfig)
