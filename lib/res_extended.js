'use strict';

module.exports = () => {
    return (req, res, next) => {
        let response = {};
        const orig_send = res.send;

        res.warn = function (status, error) {
            if (typeof error === 'undefined' ) {
                error = status;
                status = 400;
            }

            res.status(status)
                .send(error);
        };

        res.send = function (data) {
            res.send = orig_send;

            if (typeof data === 'undefined' && Object.keys(response).length > 0) {
                return res.send(JSON.stringify(response));
            }

            res.send(data);
        };

        res.data = function (data) {
            if (typeof data !== 'object') {
                throw new Error("Data must be type object.")
            }

            // check for reserved keys
            if (typeof response.data !== 'object') {
                response.data = {};
            }

            Object.assign(response.data, data);

            return res;
        };

        res.add_data = function () {
            let args = get_key_value.apply({}, arguments);

            if (typeof args.key !== 'string') {
                throw new Error("Key must be type string.")
            }

            if (typeof args.value === 'undefined') {
                throw new Error("Value is required.")
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            if (typeof response.data[args.key] === 'undefined') {
                response.data[args.key] = [];
            }

            if (Array.isArray(args.value)) {
                response.data[args.key] = response.data[args.key].concat(args.value);
            } else {
                response.data[args.key].push(args.value);
            }

            return res;
        };

        res.items = function (items) {
            if (!Array.isArray(items)) {
                throw new Error("Items must be type array.")
            }

            res.data({items});

            return res;
        };

        res.add_item = function (item) {
            res.add_data('items', item);

            return res;
        };

        res.meta = function (meta) {
            if (typeof meta !== 'object') {
                throw new Error("Meta must be type object.")
            }
            if (!meta.hasOwnProperty('code')) {
                throw new Error("Meta must have property code.")
            }

            Object.assign(response, {meta});

            return res;
        };

        res.add_error = function () {
            let args = Array.prototype.slice.call(arguments);
            let key = undefined;
            let value = undefined;

            if (args.length > 1) {
                if (typeof args[0] !== 'string') {
                    throw new Error('Error key should be type string.');
                }

                key = args[0];
                value = args[1];
            } else {
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
                if (typeof key === 'undefined') {
                    response.errors = [];
                } else {
                    response.errors = {};
                }
            }

            if (typeof key === 'undefined') {
                response.errors.push(value)
            } else {
                if (typeof response.errors[key] === 'undefined') {
                    response.errors[key] = [];
                }

                response.errors[key].push(value);
            }

            return res;
        };

        res.limit = function (limit) {
            if (typeof limit !== 'number') {
                throw new Error("Limit must be type number.")
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            Object.assign(response.data, {limit});

            return res;
        };

        res.total = function (total) {
            if (typeof total !== 'number') {
                throw new Error("Total must be type number.")
            }

            if (typeof response.data !== 'object') {
                response.data = {};
            }

            Object.assign(response.data, {total});

            return res;
        };


        next();
    };
};

function get_key_value() {
    let args = Array.prototype.slice.call(arguments);

    let key = undefined;
    let value = undefined;

    if (args.length > 1) {
        key = args[0];
        value = args[1];
    } else {
        let keys = Object.keys(args[0]);
        key = keys.length ? keys[0] : undefined;
        value = key && args[0][key];
    }

    return {key, value}
}
