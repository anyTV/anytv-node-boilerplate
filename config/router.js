'use strict';

const importer = require('anytv-node-importer');



module.exports = router => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.get('/user/:id', __.user.get_user);

    router.post('/api/auth/login', __.auth.login);
    router.post('/api/auth/logout', __.auth.logout);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
