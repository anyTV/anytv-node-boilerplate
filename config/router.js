'use strict';

const importer = require('anytv-node-importer');
const router_extended = require('lib/router_extended');

const require_token = require('controllers/middlewares/access_token');



module.exports = router => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    const extended = router_extended(router);
    router.del = router.delete;

    extended.get('/user/:id', __.user.get_user);

    extended.post('/api/auth/login', __.auth.login);

    // All routes below require token
    extended.all('/api/*', require_token);
    extended.post('/api/auth/logout', __.auth.logout);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
