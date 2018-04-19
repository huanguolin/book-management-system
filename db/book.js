'use strict';

const Sequelize = require('sequelize');
const config    = require('./config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000,
    }
});

const Book = sequelize.define('book', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    name: Sequelize.CHAR(64),
    author: Sequelize.CHAR(32),
    cover: Sequelize.CHAR(255),
    description: Sequelize.CHAR(255),
}, {
    timestamps: false,
});

module.exports = Book;