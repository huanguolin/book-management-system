'use strict';

const db = require('../db');

module.exports = db.defineModel('book', {
    name: db.STRING(128),
    author: db.STRING(128),
    cover: {
        type: db.STRING(256),
        allowNull: true,
    },
    description: {
        type: db.STRING(1024),
        allowNull: true,
    },
});
