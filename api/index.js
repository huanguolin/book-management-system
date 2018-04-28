'use strict';

const book = require('./book');
const books = require('./books');
const cover = require('./cover');

const apiList = [
    ...book,
    ...books,
    ...cover
];

const PATH_PREFIX = '/api';

function registerApi (app, api) {

    const path = PATH_PREFIX + api.path;
    const allowedMethods = Object.keys(api.methods);

    app.all(path, function (req, res, next) { 
        
        // allow cross origin
        if (req.method === 'OPTIONS') {
            res.header("Access-Control-Allow-Methods", allowedMethods.map(e => e.toUpperCase()).join());
            res.send();
            return;
        }

        // handle not allow method
        const needle = allowedMethods.indexOf(req.method.toLowerCase());
        if (needle === -1) {
            res.append('Allow', allowedMethods.map(e => e.toUpperCase()).join());
            res.status(405).send();
            return;
        }

        // pre-proc
        if (typeof api.preproc !== 'function') {
            next();
        } else {
            api.preproc(req, res, next);
        }
    });

    allowedMethods.forEach(k => app[k](path, api.methods[k]));
}

function registerAllApi (app) {
    apiList.forEach(api => registerApi(app, api));
}

module.exports = registerAllApi;