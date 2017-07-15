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
                use: "babel-loader"
            }
        ]
    },
    devtool: "source-map"
};
