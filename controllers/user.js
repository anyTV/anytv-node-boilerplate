'use strict';

const mysql   = require('anytv-node-mysql');
// const winston = require('winston');

/**
 * @api {get} /user/:id Get user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} user_id User's unique ID
 * @apiSuccess {String} date_created Time when the user was created
 * @apiSuccess {String} date_updated Time when last update occurred
 */
exports.get_user = (req, res) => {

    function start () {
        mysql.use('my_db')
            .query(
                `INSERT INTO users2(id, name) values (1, "raven")
                 ON DUPLICATE KEY UPDATE name = "johnn", date_updated = NOW();`,
                send_response
            )
            .end();
    }

    function send_response (err, result) {

        console.log(JSON.stringify(result));

        res.send({message: 'aloha'});
    }

    start();
};


exports.say_hello = (req, res, next) => {

    function start () {
        console.log('hello');
        next();
    }

    start();
};
