'use strict';

const model = require('./models');

(async () => {
    try {
        await model.sync();
        console.log('init db ok.');
    } catch (e) {
        console.error('init db fail: ' + e.message);
    }

    process.exit(0);
})();