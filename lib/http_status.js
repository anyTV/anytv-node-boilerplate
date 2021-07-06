'use strict';

const {STATUS_CODES} = require('http');
const {transform, snakeCase} = require('lodash');

/***
 * @returns {Object}
 * @example
 * {
 *     "OK": 200,
 *     "BAD_REQUEST": 400,
 *     "NOT_FOUND": 404,
 *     "INTERNAL_SERVER_ERROR": 500
 * }
 */
module.exports = transform(
    STATUS_CODES,
    (result, value, key) => result[snakeCase(value).toUpperCase()] = +key,
    {}
);
