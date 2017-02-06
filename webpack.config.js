module.exports = {
    entry: './demo/scripts.js',
    output: {
        path: '.',
        filename: './demo/scripts.dist.js',
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
