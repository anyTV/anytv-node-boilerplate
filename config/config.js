'use strict';

const importer = require('anytv-node-importer');
const _    = require('lodash');
const path = require('path');

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
        base_url: 'https://dev.freedom.tm',
        client_id: 'ee8364da-3826-4c98-870f-b72129edb7d5',
        client_secret: '0d546ef4-8cb5-4ff2-8a16-4a916edd17b8',
        //Since the boilerplate will be the template for every project, is this okay to be named "Freedom Tool Service"?
        user_agent: 'Freedom Tool Service',
        endpoints: {
            USER_INFORMATION: '/v1/api/user',
            OAUTH_ACCESS_TOKEN: '/oauth/access_token'
        }
    },

    ACCOUNTS_API: {
        base_url: 'https://accounts.freedom.tm/api/v2',
        client_id: 'ad08dcbd-845b-415f-8cb4-7bbb0b32fbc7',
        client_secret: '7b594211-9a73-4770-9450-d870c7eeb4db',
        scopes: {
            DASHBOARD: {
                USER: ['https://www.freedom.tm/auth/user'],
                USER_READONLY: ['https://www.freedom.tm/auth/user.readonly'],
                ROLES_READONLY: ['https://www.freedom.tm/auth/roles.readonly'],
                PERMISSION_READONLY: ['https://www.freedom.tm/auth/permission.readonly'],
                ROLES: ['https://www.freedom.tm/auth/roles'],
            },
        }
    },

    CUDL: {
        rejectUnauthorized: false
    },

    JWT_FIELDS: ['name', 'user_id', 'freedom_id', 'email'],

    JWT: {
        ALGO: 'HS256',
        SECRET: 'b87c1fc1-2023-11eb-8ecc-7824af44c1d1',
        EXPIRATION: 60 * 60 * 24 * 30 * 7, // expires in 7 days
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
