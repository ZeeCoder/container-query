module.exports = {
    entry: './demo/scripts.js',
    output: {
        path: './demo/dist',
        filename: 'scripts.dist.js',
    },
    module: {
        rules: [
            {
                test: /.*\.js$/,
                use: 'babel-loader',
            }
        ]
    },
    devtool: 'source-map',
};
