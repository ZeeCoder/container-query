const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname + "/web/dist",
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.pcss$/,
        use: [
          "style-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("postcss-nested")({ bubble: ["container"] }),
                require("postcss-media-minmax")(),
                require("autoprefixer")(),
                require("@zeecoder/postcss-container-query")()
              ]
            }
          }
        ]
      }
    ]
  },
  devtool: "source-map"
  // plugins: [new BundleAnalyzerPlugin()],
};
