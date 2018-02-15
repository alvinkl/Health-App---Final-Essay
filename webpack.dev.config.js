const path = require('path')
const webpack = require('webpack')

// Node Server Config
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const alias = require('./aliases')

const ENV = process.env.NODE_ENV || 'development'

const commonModule = {
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: 'babel-loader',
        },
    ],
}

const resolve = {
    alias,
    extensions: ['.js', '.jsx'],
}

const serverConfig = {
    name: 'server',

    entry: [
        'babel-polyfill',
        'webpack/hot/poll?1000',
        path.resolve(__dirname, 'src/server/index.js'),
    ],

    module: commonModule,

    watch: true,

    target: 'node',

    resolve,

    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],

    plugins: [
        new NodemonPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([{ from: 'src/server/views', to: 'views' }]),
    ],

    node: {
        __dirname: true,
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.build.js',
    },
}

const clientConfig = {
    name: 'client',

    entry: ['babel-polyfill', path.resolve(__dirname, 'src/client/index.jsx')],

    module: commonModule,

    resolve,

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        historyApiFallback: true,
        hot: true,
        https: true,
        inline: true,
    },

    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: 'client.build.js',
    },
}

module.exports = [serverConfig, clientConfig]
