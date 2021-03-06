const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => [
  {
    test: /\.js$/,
    use: "babel-loader"
  },
  {
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
      "file-loader",
      {
        loader: "image-webpack-loader",
        options: {
          disable: true // webpack@2.x and newer
        }
      }
    ]
  },
  {
    test: /\.(ogg|mp3|wav|mpe?g)$/i,
    use: "file-loader"
  },
  {
    test: [/.css$|.scss$/],
    use: [
      argv.mode === "production"
        ? MiniCssExtractPlugin.loader
        : "style-loader",
      {
        loader: "css-loader", options: {
          sourceMap: true
        }
      },
      {
        loader: "sass-loader", options: {
          sourceMap: true
        }
      }
    ]
  }
];