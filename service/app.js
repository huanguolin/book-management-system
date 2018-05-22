'use strict';

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const registerAllApi = require('./api');

const app = express();

// config file upload middleware
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5M 
    abortOnLimit: true,
}));

// basic configure
app.use(express.static(path.resolve('../webapp/app')));
app.use(express.static(path.resolve('upload')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// allow cross origin
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

// register RESTful api
registerAllApi(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

    res.status(err.status || 500);

    const isApi = path => /^\/api\/.+/.test(path);

    if (isApi(req.path)) {
        res.json({ message: err.message });
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.render('error');
    }
});

module.exports = app;