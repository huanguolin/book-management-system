'use strict';

const useMysql = true;

const config = {
    dialect: useMysql ? 'mysql' : 'postgres',
    database: 'books_info',
    username: 'alvin',
    password: 'alvin',
    host    : 'localhost',
    port: useMysql ? 3306 : 5432,
};

module.exports = config;