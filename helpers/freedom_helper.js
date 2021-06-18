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
    get_user_information,
    get_oauth_access_token
};

function get_oauth_access_token(params) {
    params.client_id = client_id;
    params.client_secret = client_secret;

    return accounts.generate_token(DASHBOARD_SCOPES.USER_READONLY)
        .then(({access_token}) => {
            return cudl.post
                .set_header('Authorization', `bearer ${access_token}`)
                .set_header('User-Agent', user_agent)
                .set_opts('rejectUnauthorized', rejectUnauthorized)
                .to(`${base_url}${endpoints.OAUTH_ACCESS_TOKEN}`)
                .send(params)
                .promise();
        });
}

function get_user_information({ user_id, access_token }) {
    let url = `${base_url}${endpoints.USER_INFORMATION}${(user_id ? `/${user_id}` : '')}`;

    return cudl.get
        .set_header('User-Agent', user_agent)
        .set_opts('rejectUnauthorized', rejectUnauthorized)
        .to(`${url}?access_token=${access_token}`)
        .send()
        .promise();
}
