const path = require('path')

const serverAliases = {
    '@server': path.resolve(__dirname, './src/server'),
    '@config': path.resolve(__dirname, './src/server/config'),
    '@routes': path.resolve(__dirname, './src/server/routes'),
    '@services': path.resolve(__dirname, './src/server/services'),
}

const clientAliases = {
    '@client': path.resolve(__dirname, './src/client'),
}

module.exports = Object.assign({}, serverAliases, clientAliases)
