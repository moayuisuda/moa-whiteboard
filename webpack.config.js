const { VueLoaderPlugin } = require('vue-loader')
const { resolve, join } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

console.log(process.env.NODE_ENV)
module.exports = {
  stats: process.env.NODE_ENV === 'development' ? 'errors-only' : 'normal',
  entry: './src/main.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash].js', // 并不影响分块代码的名称
    chunkFilename: 'chunk~[name].[hash].js', // 分块代码的名称
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
    extensions: ['.js', 'vue'],
  },
  devtool: 'source-map',
  optimization: {
    minimize: process.env.NODE_ENV === 'production' ? true : false, // 开发环境不压缩
    splitChunks: {
      chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k才被抽离成splitChunk，否则合并进main.js
      minChunks: 1, // 模块被引用>=1次，便分割
      maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
      maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
      name: true, // "chunkFilename: 'async~[name].[hash].js'"中"[name]"的生成方式，影响最后打包出来的文件名
      automaticNameDelimiter: '~', // 命名分隔符
      cacheGroups: {
        vuetify: {
          test: /[\\/]node_modules[\\/]vuetify[\\/]/, // 表示默认拆分node_modules中的模块
          priority: 20,
          chunks: 'initial'
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
          priority: 10,
          chunks: 'initial'
        },
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true, // 默认使用已有的模块
        },
      },
    },
  },
  devServer: {
    contentBase: join(__dirname, 'dist'),
    compress: true,
    port: 9000,
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
        test: /\.scss$/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: resolve(__dirname, 'src/theme/variable.scss'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: process.env.NODE_ENV,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './template.html',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({}),
    new MiniCssExtractPlugin({ // 相当于是output的css配置
      filename: '[name].[hash].css',
      chunkFilename: 'chunk~[name].[hash].css',
    }),
  ],
}
