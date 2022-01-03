const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const Webpack = require('webpack')
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss|\.css$/,
        use: [
          'vue-style-loader',
          // 同时使用 vue-style-loader style-loader，报错
          // TypeError: Cannot read properties of undefined (reading 'locals')
          // 'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     esModule: false,
          //   },
          // },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new WebpackBar(), // 更加美观的进度条
    // new ProgressBarWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new Webpack.DefinePlugin({
      // moreInfo https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // new MiniCssExtractPlugin(),
  ],
  stats: 'none',
}
