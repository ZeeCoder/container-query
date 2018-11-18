module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname + "/web/dist",
    filename: "main.js"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.pcss$/,
        use: [
          "style-loader",
          "css-loader",
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
};
