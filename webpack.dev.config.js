const path = require('path')
const webpack = require('webpack')

// Node Server Config
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Client prefix for SSR
const autoprefixer = require('autoprefixer')

// Offline Plugin
const OfflinePlugin = require('offline-plugin')

const alias = require('./aliases')

const ENV = process.env.NODE_ENV || 'development'

const commonModule = [
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
    },
]

const resolve = {
    alias,
    extensions: ['.js', '.jsx'],
}

const serverConfig = {
    name: 'server',

    entry: [
        'babel-polyfill',
        'webpack/hot/poll?1000',
        path.resolve(__dirname, 'src/server/server.js'),
    ],

    module: {
        loaders: [
            ...commonModule,
            {
                test: /\.(png|ico|svg|jpg|gif)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'file-loader',
                    options: {
                        emitFile: false,
                        publicPath: path.resolve(__dirname, './public/images'),
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'isomorphic-style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },

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

    entry: [
        'react-hot-loader/patch',
        'babel-polyfill',
        path.resolve(__dirname, 'src/client/index.jsx'),
    ],

    module: {
        loaders: [
            ...commonModule,
            {
                test: [/\.svg$/, /\.jpe?g$/, /\.png$/],
                loader: 'file-loader',
                options: {
                    name: 'public/images/[name].[ext]',
                    publicPath: url => url.replace(/public/, ''),
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
            {
                test: /\.sass$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
        ],
    },

    resolve,

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],

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
