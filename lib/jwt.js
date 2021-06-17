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

    const sismemberAsync = promisify(redis_client.sismember).bind(redis_client);
    const decoded = jwt.verify(token, JWT.SECRET, {algorithms : [JWT.ALGO]});
    const is_member = await sismemberAsync(decoded.user_id, token);

    redis_client.end(true);

    if (!is_member) {
        throw new Error('Invalid token');
    }

    const user = new User(decoded);

    return user;
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

    const saddpromise = promisify(redis_client.sadd).bind(redis_client);

    await saddpromise(user.user_id, token);
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
