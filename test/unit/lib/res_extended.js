
'use strict';

const httpMocks = require('node-mocks-http');
const should = require('chai').should();
const expect = require('chai').expect();
const extended = require(process.cwd() + '/lib/res_extended');

describe('lib/res_extend', () => {

    it('should add method limit to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.limit);
            res.limit.should.be.a('function');
            done();
        });
    });

    it('res.limit should set data.limit', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let limit = 1;
            res.limit(limit).send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.limit);
            response.data.limit.should.be.a('number');
            response.data.limit.should.be.equal(limit);

            done();
        });

    });

    it('res.limit(limit) limit should be type number', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.limit('Limit must be type number.');
            }).should.throw(Error, 'Limit must be type number.');

            done();
        });

    });

    it('should add method total to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.total);
            res.total.should.be.a('function');
            done();
        });
    });

    it('res.total should set data.total', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let total = 1;
            res.total(total).send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.total);
            response.data.total.should.be.a('number');
            response.data.total.should.be.equal(total);

            done();
        });

    });

    it('res.total(total) total should be type number', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.total('total must be type number.');
            }).should.throw(Error, 'Total must be type number.');

            done();
        });

    });

    it('should add method error to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.error);
            res.error.should.be.a('function');
            done();
        });
    });

    it('res.error should add item to errors', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let errs = [
                {code: '123', message: 'message 123'},
                {code: '321', message: 'message 321'}
            ];

            errs.forEach(function (err) {
                res.error(err);
            });

            res.send();

            let response = JSON.parse(res._getData());

            should.exist(response.errors);
            response.errors.should.be.a('array');

            errs.forEach(function(err) {
                response.errors.should.include(err);
            })

            done();
        });
    });

    it('res.error should accept (key, value)', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let key = 'key';
            let errs = [
                {code: '123', message: 'message 123'},
                {code: '321', message: 'message 321'}
            ];

            errs.forEach(function (err) {
                res.error(key, err);
            });

            res.send();

            let response = JSON.parse(res._getData());

            should.exist(response.errors[key]);
            response.errors[key].should.be.a('array');
            response.errors[key].should.be.deep.equal(errs);

            done();
        });
    });

    it('res.error(key, value) key should be type string', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.error({}, {});
            }).should.throw(Error, 'Error key should be type string.')
            done();
        });
    });

    it('res.error(key, value) value should be type object', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.error('1', 'not an object');
            }).should.throw(Error, 'Error must be type object.')
            done();
        });
    });

    it('res.error(key, value) value should have property code', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.error('1', {});
            }).should.throw(Error, 'Error must have property code.');
            done();
        });
    });

    it('res.error(key, value) value should have property message', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.error('1', {code: '3RR0RC0D3'});
            }).should.throw(Error, 'Error must have property message.');
            done();
        });
    });

    it('should add method meta to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.meta);
            res.meta.should.be.a('function');
            done();
        });
    });

    it('res.meta should set data.meta', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let meta = {code: '123'};
            res.meta(meta).send();

            let response = JSON.parse(res._getData());

            should.exist(response.meta);
            response.meta.should.be.a('object');
            response.meta.should.be.deep.equal(meta);

            done();
        });
    });

    it('res.meta(meta) meta should be type object', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.meta('some string that is not object')
            }).should.throw(Error, 'Meta must be type object.')

            done();
        });
    });

    it('res.meta(meta) meta should have property code', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.meta({not_code: 'should throw error'})
            }).should.throw(Error, 'Meta must have property code.')

            done();
        });
    });

    it('should add method warn to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.warn);
            res.warn.should.be.a('function');

            done();
        });
    });

    it('res.warn should default to status 400', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let error = 'Error warning.';
            res.warn(error);

            let response = res._getData();
            res.statusCode.should.be.equal(400);

            done();
        });
    });

    it('res.send should return json if res_extended method was called', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let error = 'Error warning.';
            res.items([{id: 1}, {id: 2}]).send();

            let response = JSON.parse(res._getData());

            done();
        });
    });


    it('res.send should return data if passed', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let data = 'some message';
            res.items([{id: 1}, {id: 2}]).send(data);

            let response = res._getData();
            response.should.be.equal(data);

            done();
        });
    });

    it('should add method data to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.data);
            res.data.should.be.a('function');

            done();
        });
    });

    it('res.data should add data[key]', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let members = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ];

            res.data({members}).send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.members);
            response.data.members.should.be.a('array');
            response.data.members.should.be.deep.equal(members);

            done();
        });
    });

    it('res.data should be type object', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.data('key');
            }).should.throw(Error, 'Data must be type object.');

            done();
        });
    });

    it('should add method datum to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.datum);
            res.datum.should.be.a('function');

            done();
        });
    });

    it('res.datum  should append to data[key]', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let members = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ];
            let data = {
                members: [
                    {id: 3, name: 'Joe'}
                ]
            };
            let expected_result = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'},
                {id: 3, name: 'Joe'}
            ];

            res.data({members})
                .datum(data)
                .send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.members);
            response.data.members.should.be.a('array');
            response.data.members.should.be.deep.equal(expected_result);

            done();
        });
    });

    it('res.datum(key, value) key should be type string', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.datum({}, {id: 1});
            }).should.throw(Error, 'Key must be type string.');

            done();
        });
    });

    it('res.datum should accept (key, item)', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let key = 'members';
            let members = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ];
            let member = {id: 3, name: 'Joe'}
            let expected_result = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'},
                {id: 3, name: 'Joe'}
            ];


            res.data({members})
                .datum(key, member)
                .send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.members);
            response.data.members.should.be.a('array');
            response.data.members.should.be.deep.equal(expected_result);

            done();
        });
    });

    it('should add method items to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.datum);
            res.datum.should.be.a('function');

            done();
        });
    });

    it('res.items should set data.items', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let items = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ];

            res.items(items)
                .send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.items);
            response.data.items.should.be.a('array');
            response.data.items.should.be.deep.equal(items);

            done();
        });
    });

    it('res.items(items) items should be type array', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            (() => {
                res.items('some string');
            }).should.throw(Error, 'Items must be type array.');

            done();
        });
    });

    it('should add method item to res', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            should.exist(res.item);
            res.item.should.be.a('function');

            done();
        });
    });

    it('res.item  should append to data.items', (done) => {
        let res = httpMocks.createResponse();
        let req = httpMocks.createRequest({});
        let extended_middleware = extended();

        extended_middleware(req, res, () => {
            let items = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'}
            ];
            let item = {id: 3, name: 'Joe'};
            let expected_result = [
                {id: 1, name: 'John'},
                {id: 2, name: 'Jane'},
                {id: 3, name: 'Joe'}
            ];

            res.items(items)
                .item(item)
                .send();

            let response = JSON.parse(res._getData());

            should.exist(response.data.items);
            response.data.items.should.be.a('array');
            response.data.items.should.be.deep.equal(expected_result);

            done();
        });
    });
});

