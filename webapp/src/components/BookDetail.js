import React from 'react';
import { Link } from 'react-router-dom';

import { ts2time } from '../util';
import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './BookDetail.css';

const defaultBookInfo = {
    author: '--',
    cover: null,
    createdAt: 0,
    description:'',
    id: '/--/',
    name:'',
    updatedAt: 0,
    version: 0,
};

export default function (props) {
    const book = props.book || defaultBookInfo;
    return (        
        <div className="book-detail">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 action">
                        <Link to={ '/book/edit' }>
                            <span className="glyphicon glyphicon-pencil"></span>
                        </Link>
                        <span className="glyphicon glyphicon-remove" onClick={props.removeBook}></span>
                    </div>
            
                    <div className="col-sm-6 cover">
                        <img src={book.cover || DEFAULT_COVER} alt={book.name} />
                    </div>
            
                    <div className="col-sm-6 info">
                        <h3 className="name text-primary">{book.name}</h3>
                        <h5 className="author">{book.author}</h5>
                        <p>{book.description}</p>
                        {
                            book.version > 0 ?   
                            <div className="meta">Last update: {ts2time(book.updatedAt)}</div>
                            : 
                            ''
                        }
                        <div className="meta">
                            Create at: {ts2time(book.createdAt)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};