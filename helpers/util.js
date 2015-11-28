'use strict';
/**
    Utilities
*/

function hash (string, hash) {
    return require('crypto')
        .createHash(hash || 'sha1')
        .update('' + string)
        .digest('hex');
}

/**
 * Data validator
 * @param1 pass a sample object
    put _ as first character of the key to indicate as optional
    @example:
        get_data({
            name: '',  // any string
            age: 1, //
            admin: true,
            _skype: ''
        });
 * @param2 source (req.body, req.query, req.params)
 **/
function get_data (sample, source, ref) {
    let has_error = false;
    let final = {};
    let temp;

    ref = ref || '';

    function validate_primitive_value (sample, prop, source, source_prop, ref) {
        const source_type = typeof source[source_prop];
        const type = typeof sample[prop];

        if ((source_type === 'undefined' && prop[0] !== '_') || (source_type === 'string' && !source[source_prop])) {
            return new Error(ref + ' is missing');
        }

        if (source_type !== 'undefined' && source_type !== type) {
            return new Error(ref + ' invalid type');
        }

        if (type === 'object') {
            return get_data(sample[prop], source[source_prop], ref);
        }

        return source[source_prop];
    }

    if (typeof sample !== typeof source || (Array.isArray(sample) !== Array.isArray(source))) {
        return new Error('Sample-Source type mismatch');
    }

    if (Array.isArray(sample)) {
        temp = source.map((a, index) => {
            const ret = validate_primitive_value(sample, 0, source, index, ref + `[${index}]`);
            has_error = ret instanceof Error ? ret : false;
            return ret;
        });

        return has_error
            ? has_error
            : temp;
    }

    for (let prop in sample) {
        if (sample.hasOwnProperty(prop)) {
            let source_prop = prop;
            let data;

            if (prop[0] === '_') {
                source_prop = prop.slice(1);
            }

            data = validate_primitive_value(sample, prop, source, source_prop, (ref ? ref + '.' : '') + prop);

            if (data instanceof Error) {
                return data;
            }

            if (typeof data !== 'undefined') {
                final[source_prop] = data;
            }
        }
    }

    return final;
}



function random_string (i) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let l = i || 32;
    let str = '';

    while (l--) {
        str += possible.charAt(~~(Math.random() * 62));
    }

    return str;
}


function pad (num, size) {
    return ('000000000' + num).substr(-(size || 2));
}


function to_title_case (str) {
    return str
        ? str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
        : '';
}


function caps_first (string) {
    return string.charAt(0)
        .toUpperCase()
    + string.slice(1);
}


function split (a, n) {
    const len = a.length;
    const out = [];

    let i = 0;

    while (i < len) {
        out.push(a.slice(i, i += Math.ceil((len - i) / n--)));
    }

    return out;
}


function get_log_stream (dir) {
    const file_stream_rotator = require('file-stream-rotator');
    const moment = require('moment');
    const proc_id = process.env.cpu_number || 0;

    return file_stream_rotator.getStream({
        filename: dir + '/access-%DATE%.' + proc_id + '.log',
        frequency: 'daily',
        verbose: false,
        date_format: 'YYYY-MM-DD'
    });
}


function clone (obj) {
    return JSON.parse(JSON.stringify(obj));
}



module.exports = {
    hash,
    get_data,
    random_string,
    pad,
    to_title_case,
    caps_first,
    split,
    get_log_stream,
    clone
};
