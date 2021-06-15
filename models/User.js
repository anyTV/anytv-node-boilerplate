'use strict';

const _ = require('lodash');

const BaseClass = require('lib/BaseClass');
const config = require('config/config');

class User extends BaseClass {

    constructor(user) {
        super();
        this.user = user;
    }

    get() {
        // This will be packed into JWT which will be used for FE access and permission handling
        return {
            name: this.name,
            user_id: this.user.id,
            freedom_id: this.user.id,
            ...this.user,
        };
    }

    get name() {
        return _.join([this.user.first_name, this.user.last_name], ' ');
    }

    get_jwt_fields () {
        return _.pick(this.get(), config.JWT_FIELDS);
    }

}

module.exports = User;
