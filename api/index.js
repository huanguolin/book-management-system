'use strict';

const book = require('./book');
const books = require('./books');

const apiList = [
    ...book,
    ...books,
];

const PATH_PREFIX = '/api';

function registerApi (app, api) {

    const path = PATH_PREFIX + api.path;
    const allowedMethods = Object.keys(api.methods);

    app.all(path, function (req, res, next) {
        // handle not allow method
        const needle = allowedMethods.indexOf(req.method.toLowerCase());
        if (needle === -1) {
            res.append('Allow', allowedMethods.map(e => e.toUpperCase()).join());
            res.status(405).send();
        }

        // pre-proc
        if (typeof api.preproc !== 'function') next();
        else api.preproc(req, res, next);
    });

    allowedMethods.forEach(k => app[k](path, api.methods[k]));
}

function registerAllApi (app) {
    apiList.forEach(api => registerApi(app, api));
}

module.exports = registerAllApi;