var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './main.js',
    output: {path: __dirname, filename: 'bundle.js'},
    // devtool: 'inline-source-map',
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    // "plugins": ["transform-object-rest-spread"]
                }
            }
        ]
    }
    /*,plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle: true
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        })
    ]*/
}
