import React from 'react';
import { Link } from 'react-router-dom';

import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './BookList.css';

export default function ({ books, enterDetail }) {
    return (
        <ul className="books-list">
            {
                books.map((book, i) => (                
                    <li className="books-list-item" key={book.id}>
                        <Link to='/book/detail' className="thumb" onClick={() => enterDetail(i)}>
                            <img src={book.cover || DEFAULT_COVER} alt={book.name} />
                        </Link>
                        <h3 className="name">
                            <Link to='/book/detail' onClick={() => enterDetail(i)}>{book.name}</Link>
                        </h3>
                        <h4 className="author">{book.author}</h4>
                    </li>
                ))
            }
        </ul>
    );
}
