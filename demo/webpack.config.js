module.exports = {
    entry: './scripts.js',
    output: {
        path: './dist',
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
