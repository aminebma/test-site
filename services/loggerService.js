const logsDirPath = './logs/'
const fs = require('fs')
if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath)
}

const winston = require('winston')
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            logstash: true,
            filename: logsDirPath + 'logstash-test.log',
            json: true
        }),
    ]
})

module.exports = logger
