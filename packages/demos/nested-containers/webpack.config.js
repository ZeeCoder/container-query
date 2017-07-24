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
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: "source-map"
};
