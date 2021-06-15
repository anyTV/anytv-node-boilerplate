'use strict';

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const {
    REDIS,
    JWT
} = require('config/config');

module.exports = {
    generate
};

async function generate (user) {
    const redis_client = redis.createClient({
        host: REDIS.host,
        port: REDIS.port,
        prefix: REDIS.prefix
    });

    const token = jwt.sign(user, JWT.SECRET, {
        algorithm: JWT.ALGO,
        expiresIn: JWT.EXPIRATION
    });

    const saddpromise = promisify(redis_client.sadd).bind(redis_client);

    await saddpromise(user.user_id, token);
    redis_client.end(true);

    return token;
}
