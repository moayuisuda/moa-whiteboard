const { VueLoaderPlugin } = require("vue-loader");
const { resolve, join } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  stats: process.env.NODE_ENV === "development" ? "errors-only" : "normal",
  entry: "./src/sdk/index.js",
  devtool: "source-map",
  output: {
    path: resolve(__dirname, "dist/sdk"),
    filename: "whiteboard_sdk.js",
    libraryTarget: "umd",
    library: "Moa",
  },
  resolve: {
    alias: {
      "@": resolve("src"),
      "~": resolve("src/components/moa-whiteboard"),
    },
    extensions: [".js", "vue"],
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    compress: true,
    port: 8889,
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
              limit: 5000,
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
          "style-loader",
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
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "./template_sdk.html",
    }),
  ],
};
