const path = require('path')

const serverAliases = {
    '@server': path.resolve(__dirname, './src/server'),
    '@config': path.resolve(__dirname, './src/server/config'),
    '@routes': path.resolve(__dirname, './src/server/routes'),
    '@services': path.resolve(__dirname, './src/server/services'),
}

const clientAliases = {
    '@client': path.resolve(__dirname, './src/client'),
    '@components': path.resolve(__dirname, './src/client/components'),
}

const sharedAliases = {
    '@shared': path.resolve(__dirname, './src/shared'),
}

module.exports = Object.assign({}, serverAliases, clientAliases, sharedAliases)
