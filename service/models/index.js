'use strict';

const fs = require('fs');
const db = require('../db');

let files = fs.readdirSync(__dirname);
let curFile = 'index.js';
let modelFiles = files.filter(f => f !== curFile && f.endsWith('.js'), files);

module.exports = {};

function capitalize (s) {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
}

for (let f of modelFiles) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[capitalize(name)] = require(__dirname + '/' + f);
}

module.exports.sync = async () => await db.sync();