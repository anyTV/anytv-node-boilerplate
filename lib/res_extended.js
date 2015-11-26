'use strict';

const _ = require('lodash');

module.exports = () => {
    return (req, res, next) => {
        const response = {};
        const orig_send = res.send;

        res.warn = (status, error) => {
            if (typeof error === 'undefined' ) {
                error = status;
                status = 400;
            }

            res.status(status)
                .send(error);
        };

        res.send = (data) => {
            res.send = orig_send;

            if (typeof data === 'undefined' && Object.keys(response).length > 0) {
                return res.send(JSON.stringify(response));
            }

            res.send(data);
        };

        res.data = (data) => {
            if (typeof data !== 'object') {
                throw new Error('Data must be type object.')
            }

            // check for reserved keys
            if (typeof response.data !== 'object') {
                response.data = {};
            }

            _.assign(response.data, data);

            return res;
        };

        res.datum = function datum () {
            const args = this._get_key_value.apply({}, arguments);

            if (typeof args.key !== 'string') {
                throw new Error('Key must be type string.')
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            if (typeof response.data[args.key] === 'undefined') {
                response.data[args.key] = [];
            }

            if (Array.isArray(args.value)) {
                response.data[args.key] = response.data[args.key].concat(args.value);
            } 
            else {
                response.data[args.key].push(args.value);
            }

            return res;
        };

        res.items = (items) => {
            if (!Array.isArray(items)) {
                throw new Error('Items must be type array.')
            }

            res.data({items});

            return res;
        };

        res.item = (item) => {
            res.datum('items', item);

            return res;
        };

        res.meta = (meta) => {
            if (typeof meta !== 'object') {
                throw new Error('Meta must be type object.')
            }
            if (!meta.hasOwnProperty('code')) {
                throw new Error('Meta must have property code.')
            }

            _.assign(response, {meta});

            return res;
        };

        res.error = function error () {
            const args = Array.prototype.slice.call(arguments);
            let key, value;

            if (args.length > 1) {
                if (typeof args[0] !== 'string') {
                    throw new Error('Error key should be type string.');
                }

                key = args[0];
                value = args[1];
            } 
            else {
                value = args[0];
            }

            if (typeof value !== 'object') {
                throw new Error('Error must be type object.');
            }

            if (!value.hasOwnProperty('code')) {
                throw new Error('Error must have property code.')
            }

            if (!value.hasOwnProperty('message')) {
                throw new Error('Error must have property message.')
            }

            if (typeof response.errors === 'undefined') {
                response.errors = typeof key === 'undefined' ? [] : {};
            }

            if (typeof key === 'undefined') {
                response.errors.push(value)
            }
            else {
                if (typeof response.errors[key] === 'undefined') {
                    response.errors[key] = [];
                }

                response.errors[key].push(value);
            }

            return res;
        };

        res.limit = (limit) => {
            if (typeof limit !== 'number') {
                throw new Error('Limit must be type number.')
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            _.assign(response.data, {limit});

            return res;
        };

        res.total = (total) => {
            if (typeof total !== 'number') {
                throw new Error('Total must be type number.')
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            _.assign(response.data, {total});

            return res;
        };

        res._get_key_value = function _get_key_value() {
            const args = Array.prototype.slice.call(arguments);
            let key, value;

            if (args.length > 1) {
                key = args[0];
                value = args[1];
            }
            else {
                let keys = Object.keys(args[0]);

                key = keys.length ? keys[0] : undefined;
                value = key && args[0][key];
            }

            return {key, value};
        }

        next();
    };
};

