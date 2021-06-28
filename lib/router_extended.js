'use strict';

const _ = require('lodash');
const http = require('http');
const winston = require('winston');
const statuses = require('statuses');
const config = require('config/config');
const http_status = require('lib/http_status');

const {
    ProcessError,
    AuthorizationError
} = require('errors');

module.exports = extender;

/**
 * Creates a plain object with method handlers similar to that provided by an expressjs Router.
 * As this plain object only acts as a wrapper and is not a Router instance, the raw router passed into it
 * is still needed for Router-specific operations ie. app.use(), router.use(), etc
 *
 * @param router
 */
function extender (router) {
    const extended = {};
    const methods = _.map(http.METHODS, _.toLower);
    methods.push('all', 'param');

    _.forEach(methods, method => {
        if (!_.isFunction(router[method])) {
            return;
        }

        extended[method] = function (path, ...middlewares) {
            const async_middlewares = _.map(
                middlewares,
                middleware_error_handling
            );

            router[method](path, ...async_middlewares);
        };
    });

    return extended;
}

/**
 * Returns a new async middleware that catches errors and handles
 * both input error from indicative as well as other uncaught errors.
 *
 * Also, res.send is automatically called if the middleware
 * resolves/returns a result that is neither null or undefined.
 *
 * @param {Function} middleware
 * @returns {Function}
 * */
function middleware_error_handling (middleware) {
    return async function (...args) {
        const [, res, next] = args;

        try {
            const to_send = await middleware(...args);

            // Send given HTTP status code.
            if (_.isNumber(to_send) && !_.isNil(statuses[to_send])) {
                return res.sendStatus(to_send);
            }

            if (!_.isNil(to_send)) {
                res.send(to_send);
            }
        }
        catch (err) {
            let response = err;
            winston.error(err);

            if (err instanceof ProcessError) {
                return res.warn({
                    code: err.code,
                    message: err.message
                });
            }

            if (err instanceof AuthorizationError) {
                return res.warn({
                    code: err.code,
                    message: err.message,
                    status: http_status.FORBIDDEN
                });
            }

            if (_.has(err, '0.validation')) {
                response = {
                    code: config.VALIDATION_ERROR,
                    message: _.isString(err) ? err : _.get(err, '0.message'),
                    status: http_status.BAD_REQUEST
                };
            }

            if (_.isPlainObject(response)) {
                return res.warn(response);
            }

            next(response);
        }
    };
}
