module.exports = {
  entry: __dirname + "/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: [">1%"]
                    }
                  }
                ]
              ],
              plugins: ["transform-class-properties"]
            }
          }
        ]
      },
      {
        test: /module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("postcss-nested")({ bubble: ["container"] }),
                require("postcss-media-minmax")(),
                require("autoprefixer")(),
                require("../packages/postcss-container-query")({
                  singleContainer: false
                })
              ]
            }
          }
        ]
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
                require("../packages/postcss-container-query")()
              ]
            }
          }
        ]
      }
    ]
  },
  devtool: "source-map"
};
