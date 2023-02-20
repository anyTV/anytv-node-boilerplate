'use strict';

/**
 *	Filename has underscore because mocha runs test files alphabetically and we need this one first
 */

const { addPath } = require('app-module-path');

addPath(__dirname + '/../');
require('chai').should();
require('server');

const sinon = require('sinon');
const repo_factory = require('repositories/factory');

// cache and always return the same table instances for testing purpose
const repo_instances = {};
const repo_create = repo_factory.create;
sinon.stub(repo_factory, 'create').callsFake(table => {
    let instance = repo_instances[table];

    return instance ? instance : (repo_instances[table] = repo_create(table));
});
