'use strict';

const config = require(process.cwd() + '/config/config');

describe('App', () => {
    it('environment should default to development environment', (done) => {
		config.app.ENV.should.equal('development');
		done();
	});

    it('environment should set to test environment', (done) => {
		config.use('test').app.ENV.should.equal('test');
		done();
	});
});
