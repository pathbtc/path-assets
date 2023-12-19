const webpack = require('webpack');

const dotenv = require('dotenv');
module.exports = function override (config, env) {
    let loaders = config.resolve
    loaders.fallback = {
        "buffer": require.resolve('buffer'),
        "fs": false,
        "tls": false,
        "net": false,
        "http": require.resolve("stream-http"),
        "zlib": require.resolve("browserify-zlib") ,
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        // "util": require.resolve("util/"),
        "url": false,
        "crypto": require.resolve("crypto-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "assert": require.resolve('assert'),
        "https": require.resolve('https-browserify')
    }

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer','Buffer'],
        }),
    ])
    return config
}