const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env = {}, argv = {}) => ({
  // if this is the default entry and output it coulbe skipped
  // however it is better to keep it here for more clarity
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: require("./webpack/module.rules")(env, argv)
  },
  plugins: [
    // Any option given to Webpack client can be captured on the "argv"
    argv.mode === "development" ? new HtmlWebpackPlugin() : null,
    argv.mode === "production"
      ? new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
      : null,
    env.analyse ? new BundleAnalyzerPlugin() : null,
  ].filter(
    // To remove any possibility of "null" values inside the plugins array, we filter it
    plugin => !!plugin
  ),
  devtool: "source-map"
});