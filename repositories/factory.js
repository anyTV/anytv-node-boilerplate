'use strict';

class factory {
    static create (table) {
        const repository = require(`repositories/${table}`);

        return new repository(table);
    }
}

module.exports = factory;
