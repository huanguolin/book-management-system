'use strict';

const extractField = require('../util').extractField;
const Book = require('../models').Book;
    
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
                    res.status(422).send({ message: e.message });
                    return; // exit function 
                }

                // create data record
                try {
                    let book = await Book.create(bookInfo);
                    res.send(book);
                }  catch (e) {        
                    res.status(500).send({ message: e.message });
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
                res.status(422).send({ message: 'book id is illegal' });
                return;
            }

            let book = await Book.findByPrimary(id);
            if (!book) {
                res.status(404).send({ message: 'this book is not exists' });
                return;
            }

            req.book = book; // pass data to method

            next();
        },
        methods: {
            get (req, res) {
                res.send(req.book)
            },
            async patch (req, res) {     
                const required = [];
                const optional = ['name', 'author', 'cover', 'description'];
                let updateItems;
                
                // validate
                try {
                    updateItems = extractField(req.body, required, optional);
                } catch (e) {
                    res.status(422).send({ message: e.message });
                    return; // exit function 
                } 

                let book = req.book;
                try {
                    await book.update(updateItems);
                    res.send(book);
                }  catch (e) {  
                    console.log(e);      
                    res.status(500).send({ message: e.message });
                }
            },
            async delete(req, res) {  
                try {
                    await req.book.destroy();
                    res.send();
                }  catch (e) {        
                    res.status(500).send({ message: e.message });
                }
            }
        }
    }
];