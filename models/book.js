'use strict';

const db = require('../db');

module.exports = db.defineModel('book', {
    name: db.STRING(64),
    author: db.STRING(32),
    cover: {
        type: db.STRING(256),
        allowNull: true,
    },
    description: {
        type: db.STRING(256),
        allowNull: true,
    },
});
