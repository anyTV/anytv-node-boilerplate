'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const faker = require('test/faker');
const {REPOSITORY} = require('config/config');

const base_repository = require('repositories/base_repository');

describe('Base Repository', function () {
    const db = faker.word();
    const table = faker.word();
    const sandbox = sinon.createSandbox();
    let repo = null;

    const fields = [faker.word(), faker.word()].sort();
    const [field_a, field_b] = fields;

    beforeEach(function() {
        repo = new base_repository(db, table);
        sandbox.stub(repo, 'execute').resolves({ affectedRows: 1});
    });

    afterEach(function () {
        sandbox.verifyAndRestore();
    });

    function create_row() {
        return {
            [field_a]: faker.number(),
            [field_b]: faker.number()
        };
    }

    describe('#select_distinct', function () {
        const field = faker.word();

        it('should forward the call to select', function () {
            const select_spy = sandbox.spy(repo, 'select');

            const fake_args = [faker.word(), faker.word(), faker.word()];
            repo.select_distinct(...fake_args);

            select_spy.calledOnce.should.equal(true);
            select_spy.firstCall.args.should.deep.equal(fake_args);
        });

        it('should add the distinct modifier to the resulting select', function () {
            repo.select_distinct(field);

            const sql_produced = repo._query.toString();
            sql_produced.should.equal(
                `select distinct \`${field}\` from \`${table}\``
            );
        });

        it('should return the instance', function () {
            const return_value = repo.select_distinct(field);
            return_value.should.equal(repo);
        });
    });

    describe('#onDupUpdate', function () {

        it('should add all elements as onDupUpdate when receiving an array', async function () {
            const row = create_row();
            await repo.insert(row)
                .onDupUpdate([
                    field_a,
                ])
                .run_query();

            repo._queries[0].toString().should.equal(
                `insert into \`${table}\` (\`${field_a}\`, \`${field_b}\`) `
                + `values (${row[field_a]}, ${row[field_b]}) `
                + `on duplicate key update \`${field_a}\` = values(\`${field_a}\`)`
            );
        });

        it('should apply onDupUpdate in case of multiple queries', async function () {
            sandbox.stub(REPOSITORY, 'chunk_insert_size').value(2);
            const rows = _.times(4, () => create_row());

            await repo.insert(rows)
                .onDupUpdate([
                    field_a
                ])
                .run_query();

            const sql_string = 'on duplicate key update '
                + `\`${field_a}\` = values(\`${field_a}\`)`;
            const sql_regex_string = _.escapeRegExp(sql_string);

            repo._queries.should.be.an('array');
            repo._queries.length.should.equal(2);

            repo._queries[0].toString().should.match(new RegExp(sql_regex_string));
            repo._queries[1].toString().should.match(new RegExp(sql_regex_string));
        });
    });

    describe('#insert', function() {
        const expected_sql = `insert into \`${table}\` (\`${field_a}\`, \`${field_b}\`) values `;

        it('should return sql insert with payload as object', async function () {
            const row = create_row();
            await repo.insert(row).run_query();

            repo._queries[0].toString().should.equal(expected_sql
                + `(${row[field_a]}, ${row[field_b]})`
            );
        });

        it('should return sql insert with payload as array', async function () {
            const rows = _.times(2, () => create_row());
            await repo.insert(rows).run_query();

            repo._queries[0].toString().should.equal(expected_sql
                + `(${rows[0][field_a]}, ${rows[0][field_b]}), `
                + `(${rows[1][field_a]}, ${rows[1][field_b]})`
            );
        });

        it('should return sql insert with set as object', async function () {
            const row = create_row();
            await repo.insert().set(row).run_query();

            repo._queries[0].toString().should.equal(expected_sql
                + `(${row[field_a]}, ${row[field_b]})`
            );
        });

        it('should return sql insert with set as array', async function () {
            const rows = _.times(2, () => create_row());
            await repo.insert().set(rows).run_query();

            repo._queries[0].toString().should.equal(expected_sql
                + `(${rows[0][field_a]}, ${rows[0][field_b]}), `
                + `(${rows[1][field_a]}, ${rows[1][field_b]})`
            );
        });

        it('should return multiple sql inserts based from chunk config size', async function () {
            sandbox.stub(REPOSITORY, 'chunk_insert_size').value(2);

            const rows = _.times(4, () => create_row());
            await repo.insert(rows).run_query();

            const first_chunk_string =
                `(${rows[0][field_a]}, ${rows[0][field_b]}), `
                + `(${rows[1][field_a]}, ${rows[1][field_b]})`;

            const first_regex_string = _.escapeRegExp(first_chunk_string);

            const second_chunk_string =
                `(${rows[2][field_a]}, ${rows[2][field_b]}), `
                + `(${rows[3][field_a]}, ${rows[3][field_b]})`;

            const second_regex_string = _.escapeRegExp(second_chunk_string);

            repo._queries.should.be.an('array');
            repo._queries.length.should.equal(2);

            repo._queries[0].toString().should.match(new RegExp(first_regex_string));
            repo._queries[1].toString().should.match(new RegExp(second_regex_string));
        });

        it('should return multiple sql inserts using set', async function () {
            sandbox.stub(REPOSITORY, 'chunk_insert_size').value(2);

            const rows = _.times(4, create_row);
            await repo.insert()
                .set(rows)
                .run_query();

            const first_chunk_string =
                `(${rows[0][field_a]}, ${rows[0][field_b]}), `
                + `(${rows[1][field_a]}, ${rows[1][field_b]})`;

            const first_regex_string = _.escapeRegExp(first_chunk_string);

            const second_chunk_string =
                `(${rows[2][field_a]}, ${rows[2][field_b]}), `
                + `(${rows[3][field_a]}, ${rows[3][field_b]})`;

            const second_regex_string = _.escapeRegExp(second_chunk_string);

            repo._queries.should.be.an('array');
            repo._queries.length.should.equal(2);

            repo._queries[0].toString().should.match(new RegExp(first_regex_string));
            repo._queries[1].toString().should.match(new RegExp(second_regex_string));
        });

        it('should throw error if set was called as not object/array', function () {
            const row = create_row();

            (function () {
                repo.insert()
                    .set(field_a, row[field_a])
                    .set(field_b, row[field_b]);
            }).should.throw(Error, 'Invalid parameters, only accept plain object or array.');

        });

    });

    describe('#update', function() {
        const expected_sql = `update \`${table}\` set `;

        it('should return sql update with payload as object', async function () {
            const row = create_row();
            await repo.update()
                .set(row)
                .where('id', 1)
                .run_query();

            repo._queries[0].toString().should.equal(expected_sql
                + `\`${field_a}\` = ${row[field_a]}, `
                + `\`${field_b}\` = ${row[field_b]}`
                + ' where \`id\` = 1'
            );
        });
    });

    describe('#where_in_objects', function() {
        const expected_sql = `select * from \`${table}\``;

        it('should ignore empty filters', async function () {
            await repo.select()
                .where_in_objects([])
                .run_query();

            repo._queries[0].toString().should.equal(expected_sql);
        });

        it('should throw an error when array of filters is malformed', async function () {
            try {
                await repo.select()
                    .where_in_objects([
                        create_row(),
                        [{},{}],
                        {},
                        faker.word
                    ])
                    .run_query();
            } catch(e) {
                e.should.equal(Error, '[BaseModel] filters is not a valid array of object');
            }
        });

        it('should return sql update with payload as object', async function () {
            let objects = [
                create_row(),
                create_row(),
            ];

            await repo.select()
                .where_in_objects(objects)
                .run_query();

            repo._queries[0].toString().should.equal(
                [
                    expected_sql,
                    `where ((\`${field_a}\` = ${objects[0][field_a]} and \`${field_b}\` = ${objects[0][field_b]})`,
                    `or (\`${field_a}\` = ${objects[1][field_a]} and \`${field_b}\` = ${objects[1][field_b]}))`,
                ].join(' ')
            );
        });

        it('should pick and filter by fields', async function () {
            let objects = [
                create_row(),
                create_row(),
            ];

            await repo.select()
                .where_in_objects(objects, [field_a])
                .run_query();

            repo._queries[0].toString().should.equal(
                [
                    expected_sql,
                    `where ((\`${field_a}\` = ${objects[0][field_a]})`,
                    `or (\`${field_a}\` = ${objects[1][field_a]}))`,
                ].join(' ')
            );
        });
    });

    describe('#select', function () {
        it('should accept plain objects for selecting and aliasing', function () {
            const field_definition = 'coalesce(earnings, 0)';
            const field_alias = 'Earnings Amount';
            const selection = {
                [field_alias]: field_definition
            };

            const sql_string = repo.select(selection)._query.toString();

            sql_string.should.equal(
                `select \`${field_definition}\` as \`${field_alias}\` from \`${table}\``
            );
        });
    });

    describe('#knex', function () {
        it('should return a clone of the squel instance', function () {
            const filter = create_row();
            const knex = repo.select()
                .where(filter)
                .knex;

            knex.should.equal(repo._query);
        });
    });
});
