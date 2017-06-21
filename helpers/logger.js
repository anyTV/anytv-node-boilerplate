'use strict';

const daily   = require('winston-daily-rotate-file');
const config  = require('config/config');
const winston = require('winston');
const moment  = require('moment');

const stamp   = () => moment.utc().format('YYYY-MM-DD HH:mm:ss:SSS[ms]');


// remove default
// then replace with a better one
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: config.app.LOG_LEVEL || 'silly',
    colorize: true,
    timestamp: stamp
});


// handle error logs
winston.add(winston.transports.File,{
    dirname: config.app.LOGS_DIR,
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
            dirname: config.app.LOGS_DIR,
            filename: 'access',
            colorize: false,
            json: false
        })
    ]
});
