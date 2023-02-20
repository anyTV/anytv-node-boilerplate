'use strict';

const _ = require('lodash');
const mysql = require('anytv-node-mysql');
const log = require('winston');
const knex = require('knex')({ client: 'mysql', useNullAsDefault: true });

const Logger = require('helpers/logger');
const { wrap_if_not_array } = require('helpers/util');
const BaseClass = require('lib/BaseClass');
const utils = require('helpers/util');

const Async = require('async');
const { REPOSITORY } = require('config/config');

/**
 * XXX Regarding class names for repository
 *
 * The REQUIRED case is snake_case. We want snake_case to be used since we want
 * direct mapping of class names to the table names that the repository
 * is matched with. e.g. masspay_gen.js is mapped to earnings.masspay_gen
 *
 * Note that this only applies to repositories under /repositories.
 *
 * For the discussion regarding this,
 * @see {@link https://github.com/anyTV/earnings/pull/674 Pull#674}
 */

/**
 * @class base_repository
 * @classdesc Base class for all repository, should NOT be used as singleton, MUST be instantiated each time
 * @extends BaseClass
 */
class base_repository extends BaseClass {
    constructor(db, table, alias) {
        super();
        this._db = db;
        this._table = (table instanceof base_repository)
            ? table._query
            : table;
        this._operation = null;
        this._query = null;
        this._queries = null;
        this.alias = alias;
        this.log_on_create = false;
        this.log_details = {};
    }

    enable_log_on_create() {
        this.log_on_create = true;

        return this;
    }

    disable_log_on_create() {
        this.log_on_create = false;

        return this;
    }

    set_log_detail(key, value) {
        if (_.isPlainObject(key)) {
            return this.set_log_object(key);
        }

        this.log_details[key] = value;

        return this;
    }

    set_log_object(new_log_object, replace = false) {
        if (replace) {
            this.log_details = _.cloneDeep(new_log_object);
        }
        else {
            _.merge(this.log_details, new_log_object);
        }

        return this;
    }

    /*
    * CREATE
    * */
    insert(...payload) {
        this._query = knex
            .into(this._table);

        this.set(...payload);
        this._operation = 'insert';

        return this;
    }

    /*
    * UPDATE
    * */
    update(ids, ...payload) {
        const table = this.alias ? {[this.alias]: this._table} : this._table;

        this._query = knex
            .table(table);

        if (ids) {
            if (_.isNumber(ids) || utils.isPrimitiveInteger(ids)) {
                this.where('id', ids);
            }
            else if (_.isArray(ids) && _.every(ids, i => _.isNumber(parseInt(i)))) {
                this.where_in('id', ids);
            }
            else if (_.isString(ids)) {
                this.where(ids);
            }
        }

        this.set(...payload);
        this._operation = 'update';

        return this;
    }

    /***
     * @param {Object | Array} args
     * @returns {this}
     */
    set(args) {
        if (!this._query) {
            throw new Error('Call insert() or update() first');
        }

        if (_.isEmpty(args)) {
            return this;
        }

        if (!_.isPlainObject(args) && !_.isArray(args)) {
            throw new Error('Invalid parameters, only accept plain object or array.');
        }

        this._payloads = args;

        return this;
    }

    /*
    * RETRIEVE
    * */
    get_by_id(ids, fields = []) {
        ids = wrap_if_not_array(ids);
        fields = wrap_if_not_array(fields);

        if (!ids.length) {
            return [];
        }

        return this.select(fields)
            .where('id', 'IN', ids)
            .run_query()
            .then(rows => {
                if (fields.length) {
                    return _.mapValues(rows, row => _.pick(row, fields));
                }

                return rows;
            });
    }

    select(fields, left_join_table = null, alias = null, left_join_args = null) {

        const table = this.alias ? {[this.alias]: this._table} : this._table;

        this._query = knex
            .from(table);

        if (left_join_table && left_join_args) {
            this.left_join(left_join_table, alias, left_join_args);
        }

        if (fields) {
            if (_.isPlainObject(fields)) {
                _.forEach(
                    fields,
                    (field_name, field_alias) => this._query.select({[field_alias]: field_name})
                );
            }
            else {
                fields = wrap_if_not_array(fields);
                _.forEach(fields, (field) => {
                    if (_.isArray(field)) {
                        this._query.select(...field);
                    } else {
                        this._query.select(field);
                    }
                });
            }
        }

        return this;
    }

    count_distinct(...args) {
        this._query = knex.countDistinct(...args)
            .from(this._table);

        return this;
    }

    select_distinct(...args) {
        this.select(...args);
        this._query.distinct();

        return this;
    }

    orWhere(...args) {
        if (args.length === 1 && _.isString(args[0])) {
            this._query.orWhereRaw(args[0]);

            return this;
        }

        this._query.orWhere(...args);

        return this;
    }

    join(join_table, alias, join_args) {
        if (join_table instanceof base_repository) {
            join_table = join_table._query;
        }

        this._query.join({[alias]: join_table}, knex.raw(join_args));

        return this;
    }

    left_join(left_join_table, alias, left_join_args) {
        if (left_join_table instanceof base_repository) {
            left_join_table = left_join_table._query;
        }

        this._query.leftJoin({[alias]: left_join_table}, knex.raw(left_join_args));

        return this;
    }

    group(fields) {
        fields = wrap_if_not_array(fields);
        _.forEach(fields, field => this._query.groupBy(field));

        return this;
    }

    limit(limit) {
        this._query.limit(limit);

        return this;
    }

    offset(offset) {
        this._query.offset(offset);

        return this;
    }

    order(field, direction) {
        if (_.isBoolean(direction)) {
            direction = direction ? 'asc' : 'desc';
        }

        this._query.orderBy(field, direction);

        return this;
    }

    where(...args) {
        if (!this._query) {
            throw new Error('Call select() first');
        }

        if (_.isEmpty(args)) {
            return this;
        }

        // where({ id: 1, name: 'first' })
        // where({ name: '%first', label: '%last' }, 'LIKE');
        if (_.isPlainObject(args[0])) {
            _.forEach(
                args[0],
                (value, field) => {
                    if (_.isArray(value)) {
                        this.where_in(field, value);
                    } else {
                        this.where(field, _.get(args, '1', '='), value);
                    }
                });

            return this;
        }

        // where('name', 'LIKE', '%first%')
        if (args.length === 3) {
            this._query.where(args[0], args[1], args[2]);

            return this;
        }

        // where('id', '1')
        if (args.length === 2) {
            if (_.isArray(args[1])) {
                this.where_in(args[0], args[1]);
            } else {
                this.where(args[0], '=', args[1]);
            }

            return this;
        }

        // where('date = NOW()')
        if (args.length === 1 && _.isString(args[0])) {
            this._query.whereRaw(args[0]);

            return this;
        }

        // where(function () { }) for chaining
        if (args.length === 1 && _.isFunction(args[0])) {
            this._query.where(args[0]);

            return this;
        }

        throw new Error('Invalid parameters');
    }

    where_in(field, data_array) {
        if (_.isArray(data_array)) {
            this._query.whereIn(field, data_array);
        }
        else {
            log.warn('[BaseModel] data_array in WHERE IN clause is not a valid array', data_array);
            log.warn(this._query.toString(), data_array);
        }

        return this;
    }

    where_in_objects(filters = [], fields = []) {
        if (_.isEmpty(filters) && !_.isArray(filters)) {
            log.warn('[BaseModel] filters is empty', filters);

            return this;
        }

        this._query.where(function () {
            for (let filter of filters) {
                filter = _.isEmpty(fields)
                    ? filter
                    : _.pick(filter, fields);

                if (_.isEmpty(filter) || !_.isPlainObject(filter)) {
                    log.warn(this._query.toString(), filters);
                    throw new Error('[BaseModel] filters is not a valid array of objects', filters);
                }

                this.orWhere(function () {
                    _.each(filter, (value, key) => {
                        if (!_.isNil(value)) {
                            this.where(key, value);
                        }
                    });
                });
            }
        });

        return this;
    }

    where_not_in(field, data_array) {
        if (_.isArray(data_array)) {
            this._query.whereNotIn(field, data_array);
        }
        else {
            log.warn(this._query.toString(), data_array);
            throw new Error('[BaseModel] data_array in WHERE NOT IN clause is not a valid array', data_array);
        }

        return this;
    }

    where_like(field, value) {
        this._query.where(field, 'LIKE', value);

        return this;
    }

    having(condition, ...args) {
        // having(condition, value)
        if (arguments.length === 2) {
            this._query.havingRaw(condition, [...args]);

            return this;
        }

        this._query.having(condition, ...args);

        return this;
    }

    /*
    * DELETE
    * */
    delete(ids = []) {
        this._query = knex
            .delete()
            .from(this._table);

        ids = wrap_if_not_array(ids);
        if (ids.length) {
            this.where_in('id', ids);
        }

        return this;
    }

    with(...args) {
        this._query.with(...args);

        return this;
    }

    run_query() {
        this._queries = this._build_queries();

        return new Promise((resolve, reject) => {
            Async.mapLimit(this._queries,
                REPOSITORY.parallel_limit,
                async query => await this.execute(query),
                (err, results) =>  {
                    if (err) {
                        reject(err);
                    }

                    const affectedRows = _.sumBy(results, 'affectedRows');
                    const changedRows = _.sumBy(results, 'changedRows');
                    if (!_.isNil(affectedRows)) {
                        const { insertId } = _.first(results);
                        resolve({ affectedRows, insertId, changedRows });

                        return;
                    }

                    resolve(_.flatten(results));
                }
            );
        });
    }

    _build_queries() {
        if (_.isEmpty(this._payloads)) {
            return [this._query];
        }

        if (_.isPlainObject(this._payloads)) {
            return [this._build_set(this._query, this._payloads)];
        }

        const queries = _.map(
            _.chunk(this._payloads, REPOSITORY.chunk_insert_size),
            payload => this._build_set(this._query.clone(), payload)
        );

        // reset data payloads and operation
        this._payloads = null;
        this._operation = null;

        return queries;
    }

    _build_set(query, args) {
        // set({ name: 'john', last: 'doe' }}
        if (this._operation === 'update') {
            query.update(args);

            return query;
        }

        // set([{ name: 'john' }, { name: 'jane' }])
        if (this._operation === 'insert') {
            query.insert(args);

            return query;
        }

        throw new Error('Invalid operation');
    }

    execute(query) {
        return mysql.use(this._db)
            .build(query)
            .promise()
            .then(result => {
                if (this.log_on_create) {
                    return Logger.write(_.merge({
                        context: this._table,
                        details: query.toString(),
                        ref_id: result.insertId,
                    }, this.log_details))
                        .then(() => result);
                }

                return result;
            })
            .catch(error => {
                log.error('SQL query failed with params: ', query.toSQL());

                return Promise.reject(error);
            });
    }

    // syntactic sugar for run_query().then
    then(cb = _.noop) {
        return this.run_query()
            .then(cb);
    }

    onDupUpdate(param) {
        this._query
            .onConflict()
            .merge(param);

        return this;
    }

    get knex() {
        return this._query;
    }
}


module.exports = base_repository;
