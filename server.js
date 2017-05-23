'use strict';

require('app-module-path/register');

const logger = require('helpers/logger');
const config = require('config/config');

const mysql             = require('anytv-node-mysql');
const body_parser       = require('body-parser');
const express           = require('express');
const express_validator = require('express-validator');
const winston           = require('winston');
const morgan            = require('morgan');

let handler;
let app;



function start () {
    if (handler) {
        handler.close();
    }

    // create express app
    app = express();

    // set config
    config.use(process.env.NODE_ENV);
    app.set('env', config.ENV);

    winston.info('Setting up database', config.DB.database, 'on', config.DB.host);
    // configure mysql
    mysql.set_logger(winston)
        .add('my_db', config.DB, true);


    winston.info('Starting', config.APP_NAME, 'on', config.ENV, 'environment');

    // configure express app
    app.set('case sensitive routing', true);
    app.set('x-powered-by', false);

    winston.verbose('Binding 3rd-party middlewares');
    app.use(morgan('combined', {stream: {write: logger.info}}));
    app.use(express.static(config.ASSETS_DIR));
    app.use(require('method-override')());
    app.use(body_parser.urlencoded({extended: false}));
    app.use(body_parser.json());
    app.use(express_validator(config.VALIDATOR));
    app.use(require('compression')());


    winston.verbose('Binding custom middlewares');
    app.use(require('anytv-node-cors')(config.CORS));
    app.use(require('lib/res_extended')());
    app.use(express.static('apidoc'));
    app.use(require('config/router')(express.Router()));
    app.use(require('anytv-node-error-handler')(winston));

    winston.info('Server listening on port', config.PORT);

    return app.listen(config.PORT);
}

handler = start();

module.exports = {
    app,
    start,
    handler
};
