const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/messiaen/",
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["css-hot-loader"].concat(
          ExtractTextPlugin.extract({
            publicPath: "/messiaen/dist/",
            fallback: "style-loader",
            use: ["css-loader", "resolve-url-loader", "sass-loader?sourceMap"]
          })
        )
      },
      {
        test: /\.css$/,
        use: ["css-hot-loader"].concat(
          ExtractTextPlugin.extract({
            publicPath: "/messiaen/dist/",
            fallback: "style-loader",
            use: ["css-loader"]
          })
        )
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ],
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9000
  }
};
