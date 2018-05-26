import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Pagination from '../components/Pagination';

import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './BookList.css';
import api from '../common/api';

const PAGE_SIZE = 5;

export default class BookList extends Component {
    constructor () {
        super();
        this.state = {
            books: [],
            pageIndex: 1,
            pageTotal: 1,
        };
    }

    async fetchBooks () {
        const params = {
            pageIndex: this.state.pageIndex,
            pageSize: PAGE_SIZE,
        };
        const res = await api.getBooks(params);
        this.setState({
            books: res.list,
            pageTotal: res.totalPage,
        });
    }

    prePageClick () {
        this.setState({
            pageIndex: this.state.pageIndex - 1,
        });
        setTimeout(() => this.fetchBooks(), 0);
    }

    nextPageClick () {
        this.setState({
            pageIndex: this.state.pageIndex + 1,
        });
        setTimeout(() => this.fetchBooks(), 0);
    }

    render () {
        const { books, pageIndex, pageTotal } = this.state;
        const bookIndexBase = (pageIndex - 1) * PAGE_SIZE;
        const list = books.map((book, i) => {   
            const detailUri = `/book/${bookIndexBase + i + 1}/detail`; 
            return (         
                <li className="list-item" key={book.id}>
                    <Link to={detailUri} className="thumb">
                        <img src={book.cover || DEFAULT_COVER} alt={book.name} />
                    </Link>
                    <h3 className="name">
                        <Link to={detailUri}>{book.name}</Link>
                    </h3>
                    <h4 className="author">{book.author}</h4>
                </li>
            );   
        });

        return (
            <div className="books">
                <section className="books-list">                    
                    <ul className="list">{list}</ul>
                </section>

                <section className="books-page">
                    <Pagination 
                        current={pageIndex}
                        total={pageTotal}
                        preClick={() => this.prePageClick()}
                        nextClick={() => this.nextPageClick()}/>
                </section>
            </div>
        ); 
    }

    componentDidMount () {
        this.fetchBooks();
    }
}

