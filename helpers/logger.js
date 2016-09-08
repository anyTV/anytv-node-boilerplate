'use strict';

const config  = require(__dirname + '/../config/config');
const daily   = require('winston-daily-rotate-file');
const winston = require('winston');
const moment  = require('moment');

const stamp   = () => moment.utc().format('YYYY-MM-DD HH:mm:ss:SSS[ms]');


// remove default
winston.remove(winston.transports.Console);

// replace with a better one
winston.add(winston.transports.Console, {
    level: config.LOG_LEVEL || 'silly',
    colorize: true,
    timestamp: stamp
});

// handle error logs
winston.add(winston.transports.File,{
    dirname: config.LOGS_DIR,
    filename: 'error.log',
    timestamp: stamp,
    colorize: false,
    level: 'warn',
    json: false
});


// handles access logs
module.exports = new (winston.Logger)({
    transports: [
        new daily({
            formatter: a => a.message.trim(),
            dirname: config.LOGS_DIR,
            filename: 'access',
            colorize: false,
            json: false
        })
    ]
});
