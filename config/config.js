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
            allowed_methods: 'GET, POST, PUT, OPTIONS, DELETE'
        },

        UPLOAD_DIR: path.normalize(__dirname + '/../uploads/'),
        ASSETS_DIR: path.normalize(__dirname + '/../assets'),
        VIEWS_DIR: path.normalize(__dirname + '/../views'),
        LOGS_DIR: path.normalize(__dirname + '/../logs')

    },

    // can be overridden by ${env}/database.js
    database: {
        LOCAL_DB: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'test'
        }
    },

    use: (env) => {

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
    }
};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = config.use(process.env.NODE_ENV);
