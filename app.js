const fs = require('fs')
const path = require('path')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const logger = require('./services/loggerService')
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const init = async () => {
    const host = argv.host || '127.0.0.1'
    const port = argv.port || 3001

    //Configuring the server
    const server = Hapi.server({
        host: host,
        port: port,
        routes: {
            cors: {
                origin: ['*']
            }
        },

    })

    server.state('firstParty', {
        ttl: null,
        isSecure: false,
        isHttpOnly: false,
        encoding: 'base64json',
        clearInvalid: false,
        strictHeader: false
    })

    await server.register(Inert)

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            h.state('firstParty', {id: 1})
            return h.file('public/index.html')
        }
    })

    try {
        //Launching the server
        await server.start()
        logger.info(`Server started successfully`, {host: host, port: port})
    } catch (error) {
        logger.error(`An error occurred when starting the server`, {message: error})
    }
}

init()
