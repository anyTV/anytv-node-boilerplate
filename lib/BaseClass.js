'use strict';

const _ = require('lodash');
const { has_method } = require('helpers/util');

const EXCLUDE_PROTOTYPE_METHODS = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf',
    'propertyIsEnumerable', 'toString', 'valueOf',
    'toLocaleString', 'log', 'getInstanceMethodNames'
];

/**
 * @class
 * @classdesc Base class for all
 */
class BaseClass {
    constructor() {
        const methods = this.getInstanceMethodNames();
        _.bindAll(this, methods);
    }

    /**
     * Based from: http://code.fitness/post/2016/01/javascript-enumerate-methods.html
     *
     * @param {String} options
     * @param {String} options.excludePrefix - exclude method leading by prefix
     * @param {Array} options.excludeMethods  - exclude methods in this array
     * @returns {Array} list method of instance
     */
    getInstanceMethodNames (options) {
        options = _.defaults(options, {excludePrefix: '_', excludeMethods: []});
        const methods = [];
        const excludeMethods = _.concat(
            options.excludeMethods,
            EXCLUDE_PROTOTYPE_METHODS
        );
        let proto = Object.getPrototypeOf(this);

        while (proto) {
            const propertyNames = Object.getOwnPropertyNames(proto);

            for (let name of propertyNames) {

                if (!_.startsWith(name, options.excludePrefix)
                    && !_.includes(excludeMethods, name)
                    && has_method(proto, name)
                ) {
                    methods.push(name);
                }

            }

            proto = Object.getPrototypeOf(proto);
        }

        return methods;
    }
}

module.exports = BaseClass;
