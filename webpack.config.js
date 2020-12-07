const { VueLoaderPlugin } = require('vue-loader')
const { resolve, join } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  devtool: 'source-map',
  externals: {
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 0,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template.html'
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
    })
  ],
}
