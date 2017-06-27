'use strict';

require('app-module-path/register');

const should = require('chai').should();
const request = require('supertest');
const server = require('../../server');
const api = request(server.app);


after('close server', function () {
    server.handler.close();
});

describe('User', () => {
    it('should get one user', (done) => {
        api.get('/user/cf9fcb1f-8fea-499a-b58f-c69576a11cd5')
            .expect(200)
            .end((err, res) => {
                should.not.exist(err);

                JSON.parse(res.text).data.items.length.should.be.equal(1);

                done();
            });
    });

    it('should return 404', (done) => {
        api.get('/user/wrong_id')
            .expect(404)
            .end((err) => {
                should.not.exist(err);

                done();
            });
    });

    it('should contain errors', (done) => {
        api.get('/user/wrong_id')
            .end((err, res) => {

                should.not.exist(err);
                should.exist(JSON.parse(res.text));

                done();
            });
    });
});
