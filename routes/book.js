'use strict';

const express = require('express');
const router  = express.Router();
const Book = require('../db/book');

// create
router.post('/', async (req, res) => {
    
    // TODO  validate req.body

    try {
        let book = await Book.create(req.body);
        res.send({ 
            result: 'success',
            book, 
        });
    }  catch (e) {        
        res.status(500).send({
            result: 'fail',
            message: e.message,
        });
    }
});

// get/put/delete pre-check
router.param('id', async (req, res, next, id) => {

    let pattern = /^\d+$/;
    if (!pattern.test(id)) {
        res.status(400).send('book id should be numbers');
        return;
    }

    id = parseInt(id);
    let book = await Book.findByPrimary(id);
    // console.log(`book: ${JSON.stringify(book)}`);
    if (!book) {
        res.status(404).send('this book is not exists');
        return;
    }

    req.book = book; // pass data to method

    next();
});

// query
router.get('/:id', async (req, res) => res.send(req.book));

// update
router.put('/:id', async (req, res) => {

    let updateItems = req.body;
    console.log(`update items: ${JSON.stringify(updateItems)}`);

    // TODO validate req body 

    let book = req.book;
    Object.keys(updateItems).forEach((k) => book[k] = updateItems[k]);

    try {
        await book.save();
        res.send({ result: 'success' });
    }  catch (e) {        
        res.status(500).send({
            result: 'fail',
            message: e.message,
        });
    }
});

// delete
router.delete('/:id', async (req, res) => {  
    try {
        await req.book.destroy();
        res.send({ result: 'success' });
    }  catch (e) {        
        res.status(500).send({
            result: 'fail',
            message: e.message,
        });
    }
});

module.exports = router;