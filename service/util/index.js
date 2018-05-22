'use strict';

function extractField (obj, required, optional) {
    const o = {};

    for (let k of required) {
        if (!obj.hasOwnProperty(k)) {
            throw new Error('miss required field: ' + k);
        } else if (('' + obj[k]).length === 0) {
            throw new Error('required field "' + k + '" can not be empty');
        }
        o[k] = obj[k];
    }

    for (let k of optional) {
        if (obj.hasOwnProperty(k)) o[k] = obj[k];
    }

    if (Object.keys(o).length === 0) {
        throw new Error('at least one field is required');
    }

    return o;
}

module.exports = {
    extractField,
};