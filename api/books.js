'use strict';

const extractField = require('../util').extractField;
const Book = require('../models').Book;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

module.exports = [
    {
        path: '/books',
        methods: {
            async get (req, res) {
                let page = parseInt(req.query.page || DEFAULT_PAGE);
                let pageSize = parseInt(req.query.page_size || DEFAULT_PAGE_SIZE);

                if (page < DEFAULT_PAGE) page = DEFAULT_PAGE;

                if (pageSize < 0) pageSize = DEFAULT_PAGE_SIZE;
                else if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;

                try {
                    const books = await Book.findAll({
                        offset: (page - 1) * pageSize,
                        limit: pageSize,
                    });
                    res.send({
                        list: books,
                    });
                    
                }  catch (e) {        
                    res.status(500).send({ message: e.message });
                }
            }
        }
    }
];