'use strict';

const { validate } = require('indicative').validator;
const { AuthorizationError } = require('errors');

const FreedomHelper = require('helpers/freedom_helper');
const User = require('models/User');

const jwt = require('lib/jwt');
const responses = require('lib/responses');

module.exports = {
    login
};

async function login (req) {
    const data = req.body;

    const rules = {
        code: 'required|string',
        redirect_uri: 'required|url',
        grant_type: 'required|string'
    };

    const validated_data = await validate(data, rules);
    const oauth_response = await FreedomHelper.get_oauth_access_token(validated_data);

    if (!oauth_response.access_token) {
        throw new AuthorizationError(responses.OAUTH_ERROR);
    }

    const user_info = await FreedomHelper.get_user_information({
        access_token: oauth_response.access_token
    });

    const user = new User(user_info);
    const access_token = await jwt.generate(user.get_jwt_fields());

    return {
        ...responses.AUTHENTICATED,
        data: {
            user: user.get(),
            access_token,
        }
    };
}
