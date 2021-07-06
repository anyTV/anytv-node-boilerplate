'use strict';

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const User = require('models/User');

const {
    REDIS,
    JWT
} = require('config/config');

module.exports = {
    verify,
    generate,
    remove
};

async function verify (token) {
    const redis_client = redis.createClient({
        host: REDIS.host,
        port: REDIS.port,
        prefix: REDIS.prefix
    });

    const sismember_async = promisify(redis_client.sismember).bind(redis_client);
    const decoded = jwt.verify(token, JWT.SECRET, {algorithms : [JWT.ALGO]});
    const is_member = await sismember_async(decoded.user_id, token);

    redis_client.end(true);

    if (!is_member) {
        throw new Error('Invalid token');
    }

    return new User(decoded);
}

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

    const sadd_promise = promisify(redis_client.sadd).bind(redis_client);

    await sadd_promise(user.user_id, token);
    redis_client.end(true);

    return token;
}

async function remove (user_id, token) {
    const redis_client = redis.createClient({
        host: REDIS.host,
        port: REDIS.port,
        prefix: REDIS.prefix
    });

    const srempromise = promisify(redis_client.srem).bind(redis_client);

    await srempromise(user_id, token);
    redis_client.end(true);
}
