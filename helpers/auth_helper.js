'use strict';

const _ = require('lodash');
const jwt = require('lib/jwt');

module.exports = ({user, token}) => {
    return {
        user() {
            return user.get();
        },

        token() {
            return token;
        },

        check() {
            return user && token;
        },

        get_permissions() {
            return this.user().permissions;
        },

        has_permission(permission) {
            return _.includes(this.user().permissions, permission);
        },

        get_roles() {
        },

        set_roles() {
        },

        destroy_session() {
            return jwt.remove(token);
        },

    };
};



