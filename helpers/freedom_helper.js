'use strict';

const Axios = require('axios');
const https = require('https');
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

async function get_oauth_access_token(params) {
    params.client_id = client_id;
    params.client_secret = client_secret;

    const { access_token } = await accounts.generate_token(DASHBOARD_SCOPES.USER_READONLY);
    const url = `${base_url}${endpoints.OAUTH_ACCESS_TOKEN}`;
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${access_token}`,
            'User-Agent': user_agent
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: rejectUnauthorized
        })
    };

    return await Axios.post(
        url,
        params,
        options
    );
}

async function get_user_information({ user_id, access_token }) {
    let url = `${base_url}${endpoints.USER_INFORMATION}${(user_id ? `/${user_id}` : '')}?access_token=${access_token}`;
    const params = { user_id };
    const options = {
        headers: {
            'User-Agent': user_agent
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: rejectUnauthorized
        })
    };

    return await Axios.get(
        url,
        { params },
        options
    );
}
