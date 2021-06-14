'use strict';

const { validate } = require('indicative').validator;

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
    //Still in progress
}
