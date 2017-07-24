const fs = require("fs");
const browserslist = fs.readFileSync(__dirname + "/browserslist").toString();
const browsers = browserslist.split("\n").filter(query => query !== "");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: __dirname + "/web/dist",
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /.*\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    browsers
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  devtool: "source-map"
};
