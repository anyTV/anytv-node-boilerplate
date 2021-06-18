'use strict';

module.exports = Object.freeze({
    AUTHENTICATED: {
        code: 'AUTHENTICATED',
        message: 'Successfully authenticated'
    },

    UNAUTH: {
        code: 'UNAUTH',
        message: 'Unauthorized access'
    },

    LOGGED_OUT: {
        code: 'LOGGED_OUT',
        message: 'Successfully logged out'
    },

    OAUTH_ERROR: {
        code: 'OAUTH_ERROR',
        message: 'Error occurred in getting OAUTH access token from Freedom! server'
    }
});
