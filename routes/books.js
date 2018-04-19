'use strict';

const express = require('express');
const router = express.Router();
const Book = require('../db/book');

router.get('/', async (req, res, next) => {

    console.log(`query: ${JSON.stringify(req.query)}`);

    // TODO  validate query params
    const currentPage = parseInt(req.query.start);
    const pageCount = parseInt(req.query.limit);

    try {
        const books = await Book.findAll({
            offset: (currentPage - 1) * pageCount,
            limit: pageCount,
        });
        res.send({
            list: books,
        });
        
    }  catch (e) {        
        res.status(500).send({
            result: 'fail',
            message: e.message,
        });
    }
});

module.exports = router;