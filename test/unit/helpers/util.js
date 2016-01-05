'use strict';

const util = require(process.cwd() + '/helpers/util');



describe('Util', () => {

    it('util.hash should hash the string in sha1 by default', (done) => {
        util.hash('randomsamplestring').should.equal('0d470913cf5cc7190cd5efe404c53f0bb8496321');
        done();
    });


    it('util.hash should hash the string in md5', (done) => {
        util.hash('randomsamplestring', 'md5').should.equal('3f12bc2adefa12cc2744a7a85891cca8');
        done();
    });





    it('util.get_data should strip excess payload', (done) => {
        const data = util.get_data(
            {required: 0, required2: 0, _optional: 1},
            {
                required: 1,
                required2: 0,
                required3: 3,
                optional: 4,
                optional1: 5
            }
        );

        data.should.be.an('object');

        data.should.eql({
            required: 1,
            required2: 0,
            optional: 4
        });

        done();
    });

    it('util.get_data should tell what\'s missing', (done) => {
        let data = util.get_data(
            {required: 0, required2: 0, _optional: 1},
            {
                required2: 2,
                required3: 3,
                optional: 4,
                optional1: 5
            }
        );

        data.message.should.be.equal('required is missing');

        data = util.get_data(
            {required: 0, required2: {a: {b: 1}}, _optional: 1},
            {
                required: 1,
                required2: {a: {}},
                required3: 3,
                optional: 4,
                optional1: 5
            }
        );

        data.message.should.be.equal('required2.a.b is missing');

        data = util.get_data(
            {required: 0, required2: {a: 1, b: ['']}, _optional: 1},
            {
                required: 1,
                required2: {
                    a: 0,
                    b: ['', 1]
                },
                required3: 3,
                optional: 4,
                optional1: 5
            }
        );

        data.message.should.be.equal('required2.b[1] invalid type');

        done();
    });

    it('util.get_data should not care if optional parameter is missing', (done) => {
        const data = util.get_data(
            {required: 0, required2: 0, _optional: 1},
            {
                required: 1,
                required2: 2
            }
        );

        data.should.be.an('object');
        data.should.eql({
            required: 1,
            required2: 2
        });

        done();
    });





    it('util.random_string should return a string with length 32', (done) => {
        const string = util.random_string();

        string.should.be.a('string');
        string.length.should.equal(32);

        done();
    });

    it('util.random_string should return a string with length given in the argument', (done) => {
        const string = util.random_string(5);

        string.should.be.a('string');
        string.length.should.equal(5);

        done();
    });





    it('util.pad should pad by 2 by default', (done) => {
        const string = util.pad(5);

        string.should.be.a('string');
        string.should.equal('05');
        string.length.should.equal(2);

        done();
    });

    it('util.pad should pad the number by <2nd parameter>', (done) => {
        const string = util.pad(5, 5);

        string.should.be.a('string');
        string.should.equal('00005');
        string.length.should.equal(5);

        done();
    });





    it('util.to_title_case should title-ize a string', (done) => {
        const string = util.to_title_case('im a title');

        string.should.be.a('string');
        string.should.equal('Im A Title');

        done();
    });





    it('util.caps_first should capitalize a string', (done) => {
        const string = util.caps_first('im a title');

        string.should.be.a('string');
        string.should.equal('Im a title');

        done();
    });





    it('util.split should split an array into <n> parts', (done) => {
        const array = util.split([,,,,,,,,,,,], 3);

        array.should.be.an('array');
        array.length.should.equal(3);

        done();
    });





    it('util.clone should clone an object', (done) => {
        const obj = {};
        const obj2 = obj;
        const clone = util.clone(obj);

        obj.should.be.equal(obj2);
        obj.should.not.be.equal(clone);

        done();
    });

});

