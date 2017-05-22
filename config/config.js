'use strict';

const _    = require('lodash');
const path = require('path');

const config = {

    APP_NAME: 'anyTV Node Boilerplate',

    PORT: 5000,

    CORS:  {
        allowed_headers: 'Access-Token, X-Requested-With, Content-Type, Accept',
        allowed_origins: '*',
        allowed_methods: 'GET, POST, PUT, OPTIONS, DELETE'
    },

    UPLOAD_DIR: path.normalize(__dirname + '/../uploads/'),
    ASSETS_DIR: path.normalize(__dirname + '/../assets'),
    VIEWS_DIR: path.normalize(__dirname + '/../views'),
    LOGS_DIR: path.normalize(__dirname + '/../logs'),


    DB: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    },

    VALIDATOR: {
        /**
         * Add custom validators here
         * Format: { "validatorName": function(value, [additional arguments]), ... }
         */
        customValidators: {
            isAlphaDash: (value) => {
                return value && /^[a-z0-9]+(-[a-z0-9]+)+$/i.test(value);
            },
            isArray: (value) => {
                return Array.isArray(value);
            },
            min: (value, min_value) => {
                return value >= min_value;
            },
            max: (value, max_value) => {
                return value <= max_value;
            },
            range: (value, min, max) => {
                return min <= value && value <= max;
            }
        }
    },

    use: (env) => {
        _.assign(config, require(__dirname + '/env/' + env));
        return config;
    }
};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = config.use(process.env.NODE_ENV);
