'use strict';

const config = require(process.cwd() + '/config/config');

describe('App', () => {
    it('environment should set to proper environment', (done) => {
        config.use('development').app.ENV.should.equal('development');
        config.use('production').app.ENV.should.equal('production');
        config.use('test').app.ENV.should.equal('test');
        done();
    });
});
