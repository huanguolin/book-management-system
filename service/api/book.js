'use strict';

const extractField = require('../util').extractField;
const Book = require('../models').Book;
const fs = require('fs');
const path = require('path');
    
/*
the book fields that user can modify :
{
    name, // required when create
    author, // required when create
    cover, 
    description,
}
*/  

module.exports = [  
    {
        path: '/book',
        methods: {
            async post (req, res) {
                
                const required = ['name', 'author'];
                const optional = ['cover', 'description'];
                let bookInfo;
                
                // validate
                try {
                    bookInfo = extractField(req.body, required, optional);
                } catch (e) {
                    res.status(422).json({ message: e.message });
                    return; // exit function 
                }

                // create data record
                try {
                    let book = await Book.create(bookInfo);
                    res.json(book);
                }  catch (e) {        
                    res.status(500).json({ message: e.message });
                }
            }
        }
    },

    {
        path: '/book/:id',
        async preproc (req, res, next) {
            let id = req.params.id;
            
            let pattern = /^[\w\-]+$/;
            if (!pattern.test(id)) {
                res.status(422).json({ message: 'book id is illegal' });
                return;
            }

            let book = await Book.findByPrimary(id);
            if (!book) {
                res.status(404).json({ message: 'this book is not exists' });
                return;
            }

            req.book = book; // pass data to method

            next();
        },
        methods: {
            get (req, res) {
                res.json(req.book)
            },
            async patch (req, res) {     
                const required = [];
                const optional = ['name', 'author', 'cover', 'description'];
                let updateItems;
                
                // validate
                try {
                    updateItems = extractField(req.body, required, optional);
                } catch (e) {
                    res.status(422).json({ message: e.message });
                    return; // exit function 
                } 

                let book = req.book;
                try {
                    await book.update(updateItems);
                    res.json(book);
                }  catch (e) {        
                    res.status(500).json({ message: e.message });
                }
            },
            async delete(req, res) {  
                try {
                    let cover = req.book.cover;

                    // remove data record                
                    await req.book.destroy();

                    // remove cover
                    if (cover) {
                        const coverPath = path.resolve('webapp/app', cover);
                        if (fs.existsSync(coverPath)) {
                            fs.unlinkSync(coverPath);
                        }
                    }

                    // send success result 
                    res.send();
                }  catch (e) {        
                    res.status(500).json({ message: e.message });
                }
            }
        }
    }
];