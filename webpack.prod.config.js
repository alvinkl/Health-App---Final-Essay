const path = require('path')
const webpack = require('webpack')

// Clean before build
const CleanWebpackPlugin = require('clean-webpack-plugin')

// Node Server Config
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// CSS config for server and client
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// HTML Webpack Plugin
const HTMLWebpackPlugin = require('html-webpack-plugin')

const alias = require('./aliases')

const ENV = process.env.NODE_ENV || 'production'

// Babel - Loader
const babel_loader = {
    loader: 'babel-loader',
    options: {
        plugins: [
            ['transform-class-properties'],
            ['transform-object-rest-spread'],
            ['transform-react-constant-elements'],
            ['transform-react-inline-elements'],
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

    entry: ['babel-polyfill', path.resolve(__dirname, 'src/server/server.js')],

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

    target: 'node',

    resolve,

    externals: [nodeExternals()],

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
        // new webpack.BannerPlugin({
        //     banner: 'require("source-map-support").install();',
        //     raw: true,
        //     entryOnly: false,
        // }),
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

    entry: {
        vendor: [
            'babel-polyfill',
            'classnames',
            'es6-promise',
            'lodash',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'react-router-dom',
            'react-router-redux',
            'react-router-transition',
            'react-transition-group',
        ],
        'client.build': [
            'react-hot-loader/patch',
            path.resolve(__dirname, 'src/client/require-babelPolyfill.js'),
            path.resolve(__dirname, 'src/client/index.jsx'),
        ],
        'idb-utilities': [
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(ENV),
            },
        }),
        new HTMLWebpackPlugin({
            title: 'PWA Health App',
            inject: true,
            template:
                '!!raw-loader!' +
                path.resolve(__dirname, 'src/server/views/layout.ejs'),
            filename: path.resolve(__dirname, 'build/views/layout.ejs'),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
        }),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: 'style/style.css',
            allChunks: true,
        }),
    ],

    devtool: 'cheap-mnodule-source-map',

    output: {
        path: path.resolve(__dirname, 'public', 'build'),
        publicPath: '/static/build/',
        filename: '[name].js',
    },
}

console.log('[Webpack] Bundling for ', ENV, ' environment!')

module.exports = [serverConfig, clientConfig]
