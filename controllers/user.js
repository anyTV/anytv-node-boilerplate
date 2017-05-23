'use strict';

const mysql     = require('anytv-node-mysql');
const squel     = require('squel');
const winston   = require('winston');

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
exports.get_user = function (req, res, next) {


    function start () {

       req.checkParams({
           'id': {
               notEmpty: true,
               isAlphaDash: true
           }
       });

       req.getValidationResult().then(result => {

           if (!result.isEmpty()) {
               return res.warn(result.mapped());
           }

           const query = squel.select()
               .from('users')
               .where('user_id = ?', req.params.id)
               .limit(1);

           mysql.use('my_db')
               .squel(query, send_response)
               .end();
       });
    }


    function send_response (err, result, args, last_query) {

        if (err) {
            winston.error('Error in selecting users', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'USER404', message: 'User not found'})
                .send();
        }

        res.item(result)
            .send();
    }

    start();
};
