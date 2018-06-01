import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Pagination from '../components/Pagination';

import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './BookDetail.css';
import api from '../common/api';
import { ts2time } from '../common/util';

const PAGE_SIZE = 1;

class BookDetail extends Component {
    constructor (props) {
        super(props);
        const pageIndex = Number.parseInt(props.match.params.index, 10);
        this.state = {
            pageIndex,
            pageTotal: 1,
            book: {
                id: '',
                name: '',
                author: '',
                cover: '',
                createdAt: 0,
                description: '',
                updatedAt: 0,
                version: 0,
            },
        };
    }

    async _fetchBook () {
        const params = {
            pageIndex: this.state.pageIndex,
            pageSize: PAGE_SIZE,
        };
        const res = await api.getBooks(params);
        this.setState({
            book: res.list[0],
            pageTotal: res.totalPage,
        });
    }

    _prePageClick () {
        this.setState({
            pageIndex: this.state.pageIndex - 1,
        });
        setTimeout(() => this._fetchBook(), 0);
    }

    _nextPageClick () {
        this.setState({
            pageIndex: this.state.pageIndex + 1,
        });
        setTimeout(() => this._fetchBook(), 0);
    }

    async _removeBook () {
        const msg = 'Are you sure to remove this book infomation?';  
        if (!window.confirm(msg)) {
            return;
        }

        const { book, pageIndex, pageTotal } = this.state;
        await api.removeBook(book.id);
        
        alert('remove book successfully!'); 
        if (pageIndex < pageTotal) { 
            this.setState({
                pageTotal: pageTotal - 1,
            });  
            setTimeout(() => this._fetchBook(), 0);    
        } else {      
            this.props.history.push('/books');
        } 
    }

    render () {
        const { book, pageIndex, pageTotal } = this.state;

        return (                    
            <div className="book-detail">
                <section className="detail">                    
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 action">
                                <Link to={`/book/${book.id}/edit`}>
                                    <span className="glyphicon glyphicon-pencil"></span>
                                </Link>
                                <span className="glyphicon glyphicon-remove" 
                                    onClick={() => this._removeBook()}>
                                </span>
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
                </section>                

                <section className="detail-page">
                    <Pagination 
                        current={pageIndex}
                        total={pageTotal}
                        preClick={() => this._prePageClick()}
                        nextClick={() => this._nextPageClick()}/>
                </section>
            </div>
        );
    }

    componentDidMount () {
        this._fetchBook();
    }
}

export default withRouter(BookDetail);