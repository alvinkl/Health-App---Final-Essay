const path = require('path')

const serverAliases = {
    '@server': path.resolve(__dirname, './src/server'),
    '@config': path.resolve(__dirname, './src/server/config'),
    '@routes': path.resolve(__dirname, './src/server/routes'),
    '@services': path.resolve(__dirname, './src/server/services'),
    '@handler': path.resolve(__dirname, './src/server/handler'),
    '@functions': path.resolve(__dirname, './src/server/functions'),
    '@validation': path.resolve(__dirname, './src/server/validation'),
    '@types': path.resolve(__dirname, './src/server/types'),
    '@model': path.resolve(__dirname, './src/server/model'),
}

const clientAliases = {
    '@client': path.resolve(__dirname, './src/client'),
    '@components': path.resolve(__dirname, './src/client/components'),
    '@actions': path.resolve(__dirname, './src/client/actions'),
}

const sharedAliases = {
    '@helper': path.resolve(__dirname, './src/helper'),
    '@constant': path.resolve(__dirname, './src/constant'),
    '@urls': path.resolve(__dirname, './src/urls'),
    '@root': './',
}

module.exports = Object.assign({}, serverAliases, clientAliases, sharedAliases)
