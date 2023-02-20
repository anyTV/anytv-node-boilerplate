'use strict';
require('app-module-path/register');

const accounts = require('freedom-accounts-util');
const indicative = require('indicative');
const config = require('config/config');
const {
    LOCAL_DB
} = config.DATABASE;
const pkg = require('./package.json');
const mysql = require('anytv-node-mysql');
const winston = require('winston');

module.exports = [
    new Promise(resolve => {
        mysql
            .set_logger(winston)
            .add(LOCAL_DB.database, LOCAL_DB, true);

        winston.info('DB:', LOCAL_DB.host);

        // configure accounts-util
        accounts.configure(config.ACCOUNTS_API);

        resolve();
    }),
];
