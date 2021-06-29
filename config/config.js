'use strict';

const importer = require('anytv-node-importer');
const _    = require('lodash');
const path = require('path');
const pjson = require('package.json');

const config = {

    // can be overridden by ${env}/app.js
    app: {

        APP_NAME: 'anyTV Node Boilerplate',

        PORT: 5000,

        CORS:  {
            allowed_headers: 'Access-Token, X-Requested-With, Content-Type, Accept',
            allowed_origins: '*',
            allowed_methods: 'GET, POST, PUT, OPTIONS, DELETE',
        },

        UPLOAD_DIR: path.normalize(__dirname + '/../uploads/'),
        ASSETS_DIR: path.normalize(__dirname + '/../assets'),
        VIEWS_DIR: path.normalize(__dirname + '/../views'),
        LOGS_DIR: path.normalize(__dirname + '/../logs'),

    },

    FREEDOM: {
        base_url: '',
        client_id: '',
        client_secret: '',
        user_agent: `${pjson.name}-${pjson.version}`,
        endpoints: {
            USER_INFORMATION: '/v1/api/user',
            OAUTH_ACCESS_TOKEN: '/oauth/access_token'
        }
    },

    ACCOUNTS_API: {
        base_url: '',
        client_id: '',
        client_secret: '',
        scopes: {
            DASHBOARD: {
                USER: [''],
                USER_READONLY: [''],
                ROLES_READONLY: [''],
                PERMISSION_READONLY: [''],
                ROLES: [''],
            },
        }
    },

    AXIOS: {
        rejectUnauthorized: false
    },

    VALIDATION_ERROR: 'VALIDATION ERROR',

    JWT_FIELDS: ['name', 'user_id', 'freedom_id', 'email'],

    JWT: {
        ALGO: '',
        SECRET: '',
        EXPIRATION: 60 * 60, // expires in 1 hour
    },

    REDIS: {
        host: '127.0.0.1',
        port: 6379,
        //The prefix is to follow
        prefix: ''
    },

    // can be overridden by ${env}/database.js
    database: {
        LOCAL_DB: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'test',
        },
    },

    use: env => {

        _.merge(config, importer.dirloadSync(__dirname + '/env/' + env));

        /**
         *  supports previous way of accessing config by
         *  allowing omitted filenames. example:
         *
         *  config.APP_NAME // will work
         *
         *  done via merging all keys in one object
         */
        let merged_config = _.reduce(config, (a, b) => _.merge(a, b), {});

        return _.merge(merged_config, config);
    },
};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = config.use(process.env.NODE_ENV);
