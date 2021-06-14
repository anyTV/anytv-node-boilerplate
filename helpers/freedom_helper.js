'use strict';

const cudl = require('cuddle');
const config = require('config/config');
const accounts = require('freedom-accounts-util');

const { rejectUnauthorized } = config.CUDL;
const {
    base_url,
    client_id,
    user_agent,
    endpoints,
    client_secret
} = config.FREEDOM;

const DASHBOARD_SCOPES = config.ACCOUNTS_API.scopes.DASHBOARD;


module.exports = {
    get_oauth_access_token
};

async function get_oauth_access_token(params) {
    params.client_id = client_id;
    params.client_secret = client_secret;

    const { access_token } = await accounts.generate_token(DASHBOARD_SCOPES.USER_READONLY);

    return cudl.post
        .set_header('Authorization', `bearer ${access_token}`)
        .set_header('User-Agent', user_agent)
        .set_opts('rejectUnauthorized', rejectUnauthorized)
        .to(`${base_url}${endpoints.OAUTH_ACCESS_TOKEN}`)
        .send(params)
        .promise();

}
