'use strict';

const _ = require('lodash');

class ExpectedValueError extends Error {
    constructor(msg = 'Expected value is not met', ...params) {
        super(msg, ...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExpectedValueError);
        }

        this.name = this.constructor.name;
    }
}

class ProcessError extends Error {
    constructor(code, message) {
        if (_.isPlainObject(code)) {
            super(code.message);
            this.code = code.code;
        }
        else {
            super(message);
            this.code = code;
        }
    }
}

class AuthorizationError extends ProcessError {
    constructor({code, message}) {
        super(code, message);
    }
}

module.exports = {
    ExpectedValueError,
    AuthorizationError,
    ProcessError
};
