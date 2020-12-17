const { VueLoaderPlugin } = require("vue-loader");
const { resolve, join } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { env } = require('./config')

module.exports = {
  stats: env === 'development' ? 'errors-only' : 'normal',
  entry: "./src/main.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "main.js",
  },
  resolve: {
    alias: {
      "@": resolve("src"),
    },
    extensions: [".js", "vue"],
  },
  devtool: "source-map",
  externals: {},
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|bmp|jpeg|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              limit: 0,
              name: "images/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
              resources: resolve(__dirname, "src/theme/variable.scss"),
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
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env,
      },
    }),
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({}),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};
