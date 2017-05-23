'use strict';

require('app-module-path/register');

const config = require('config/config');

describe('App', () => {
    it('environment should set to specified environment', (done) => {
        config.use('development').ENV.should.equal('development');
        config.use('test').ENV.should.equal('test');
        config.use('production').ENV.should.equal('production');
        done();
    });
});
