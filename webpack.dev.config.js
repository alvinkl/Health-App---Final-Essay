const path = require('path')
const webpack = require('webpack')

// Clean before build
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Node Server Config
const nodeExternals = require('webpack-node-externals')
const NodemonPlugin = require('nodemon-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Client prefix for SSR
const autoprefixer = require('autoprefixer')

// CSS config for server and client
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Offline Plugin
const OfflinePlugin = require('offline-plugin')

// HTML plugin
const HTMLWebpackPlugin = require('html-webpack-plugin')

const alias = require('./aliases')

const ENV = process.env.NODE_ENV || 'development'

// Babel - Loader
const babel_loader = {
    loader: 'babel-loader',
    options: {
        plugins: [
            ['transform-class-properties'],
            ['transform-object-rest-spread'],
            ['transform-react-constant-elements'],
            ['transform-react-inline-elements'],
            // require('babel-plugin-react-hot-loader/babel'),
        ],
    },
}

const server_babel_loader = Object.assign({}, babel_loader, {
    options: {
        presets: ['env', 'react'],
        plugins: [
            ...babel_loader.options.plugins,
            [
                'css-modules-transform',
                {
                    generateScopedName: '[name]__[local]__[hash:base64:5]',
                    extensions: ['.css'],
                },
            ],
            ['dynamic-import-node'],
        ],
    },
})
const client_babel_loader = Object.assign({}, babel_loader, {
    options: {
        presets: ['env', 'react'],
        plugins: [...babel_loader.options.plugins, ['dynamic-import-webpack']],
    },
})

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
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: server_babel_loader,
            },
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
        ],
    },

    watch: true,

    target: 'node',

    resolve,

    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],

    plugins: [
        // new CleanWebpackPlugin([__dirname + '/build/*'], {
        //     root: __dirname,
        //     verbose: true,
        //     watch: true,
        // }),
        // Add sourcemap support for debugging
        new webpack.DefinePlugin({
            window: {},
        }),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
        }),
        new NodemonPlugin({
            script: './build/server.build.js',
            watch: path.resolve('./build'),
            ignore: ['*.js.map'],
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new CopyWebpackPlugin([{ from: 'src/server/views', to: 'views' }]),
    ],

    node: {
        __dirname: true,
    },

    devtool: 'sourcemap',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.build.js',
    },
}

const clientConfig = {
    name: 'client',

    // entry: [
    //     'react-hot-loader/patch',
    //     'babel-polyfill',
    //     path.resolve(__dirname, 'src/client/index.jsx'),
    // ],

    entry: {
        'client.build': [
            'react-hot-loader/patch',
            // 'babel-polyfill',
            path.resolve(__dirname, 'src/client/require-babelPolyfill.js'),
            path.resolve(__dirname, 'src/client/index.jsx'),
        ],
        'idb-utilities': [
            // 'babel-polyfill',
            path.resolve(__dirname, 'src/client/require-babelPolyfill.js'),
            path.resolve(__dirname, 'src/helper/indexedDB-utilities.js'),
        ],
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: client_babel_loader,
            },
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                localIdentName:
                                    '[name]__[local]__[hash:base64:5]',
                                modules: true,
                            },
                        },
                    ],
                }),
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
        // new CleanWebpackPlugin(['public/build/*'], {
        //     root: __dirname,
        //     verbose: true,
        //     watch: true,
        // }),
        new HTMLWebpackPlugin({
            title: 'PWA Health App',
            inject: true,
            template:
                '!!raw-loader!' +
                path.resolve(__dirname, 'src/server/views/layout.ejs'),
            filename: path.resolve(__dirname, 'build/views/layout.ejs'),
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'style/style.css',
            allChunks: true,
        }),
    ],

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        historyApiFallback: true,
        hot: true,
        https: true,
        inline: true,
    },

    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, 'public', 'build'),
        publicPath: '/static/build/',
        filename: '[name].js',
    },
}

module.exports = [serverConfig, clientConfig]
