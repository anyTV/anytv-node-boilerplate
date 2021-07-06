'use strict';

const log = require('winston');

const auth = require('helpers/auth_helper');
const { AuthorizationError } = require('errors');

const jwt = require('lib/jwt');
const responses = require('lib/responses');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['access-token'];

        if (!token) {
            throw new Error('No access token');
        }

        const user = await jwt.verify(token);

        req.auth = auth({user, token});

        next();
    } catch (e) {
        log.debug('Error in access token', e.message);

        throw new AuthorizationError(responses.UNAUTH);
    }
};
