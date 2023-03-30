const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/app.js",
    speech: "./src/SpeechToText/speech.js",
  },
  output: {
    filename: "[name].js",
    publicPath: "/dist/",
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_moudels/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.png$/,
        use: [{ loader: "url-loader", options: { mimetype: "image/png" } }],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "/"),
    },
    hot: true,
    open: true,
    port: 8000,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      inject: true,
      chunks: ["app.js"],
    }),
    new HtmlWebpackPlugin({
      template: "src/SpeechToText/speech_to_text.html",
      filename: "speech_to_text.html",
      inject: true,
      chunks: ["speech.js"],
    }),
    new Dotenv({
      systemvars: true,
    }),
  ],
};
