const webpack = require('webpack');

module.exports = {
    entry: './scripts.js',
    output: {
        path: '.',
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
