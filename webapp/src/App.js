import React, { Component } from 'react';
import { 
    Route,
    Link,
    Switch,
    Redirect,
    withRouter,
} from 'react-router-dom';

// global style
import 'bootstrap-css-only/css/bootstrap.min.css';
import './App.css';

// components
import Pagination from './components/Pagination';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import AddEditBook from './components/AddEditBook';

// utils
import api from './api';

class App extends Component {

    constructor () {
        super();
        this.state = {
            pageIndex: 1,
            pageTotal: 1,
            pageSize: 5,
            books: [],
            bookIndex: 0,
            bookTotal: 0,
            enterDetail: false,
        };
    } 

    async componentDidMount () {
        await this.refreshBooks();
    }

    async refreshBooks () {
        const { pageIndex: page, pageSize, enterDetail } = this.state;
        const bookInfo = await api.getBooks({ page, pageSize });
        this.setState({
            pageTotal: enterDetail ? bookInfo.total : bookInfo.totalPage,
            books: bookInfo.list,
            bookIndex: 0,
            bookTotal: bookInfo.total,
        });
    }

    async removeBook () {
        const msg = 'Are you sure to remove this book infomation?';  
        if (!window.confirm(msg)) {
            return;
        }

        const { books, bookIndex, pageIndex, pageTotal } = this.state;
        await api.removeBook(books[bookIndex].id);
        
        alert('remove book successfully!'); 
        if (pageIndex <= 1) {            
            this.props.history.push('/books');
        } else {
            this.setState({
                pageIndex: pageIndex - 1,
                pageTotal: pageTotal - 1,
            });
        }
        setTimeout(() => this.refreshBooks(), 0);  
    }

    prePageClick () {
        this.setState({ 
            pageIndex: this.state.pageIndex - 1,
        });
        setTimeout(() => this.refreshBooks(), 0);
    } 

    nextPageClick () {
        this.setState({ 
            pageIndex: this.state.pageIndex + 1,
        });
        setTimeout(() => this.refreshBooks(), 0);
    } 

    switchToDetail (i) {  
        const { pageIndex, pageSize } = this.state;
        this.setState({ 
            pageIndex: pageSize * (pageIndex - 1) + i + 1,
            pageSize: 1,
            pageTotal: this.state.bookTotal,
            bookIndex: i,
            enterDetail: true,
        });
    }

    switchToList () {  
        // set state to default value 
        this.setState({ 
            pageIndex: 1,
            pageTotal: 1,
            pageSize: 5,
            books: [],
            bookIndex: 0,
            bookTotal: 0,
            enterDetail: false,
        });
        setTimeout(() => this.refreshBooks(), 0);
    }

    updateLocalBookInfo (book) {
        const { books, bookIndex } = this.state;
        const newBooks = books.slice(0);
        newBooks[bookIndex] = book;
        this.setState({ books: newBooks });
    }
    
    render () {
        const { pageIndex, pageTotal, books, bookIndex } = this.state;
        const currentBook = books[bookIndex];
        return (
            <div className="wrapper">                
                <header className="header">
                    <div className="content">
                        <Link to="/books" onClick={() => this.switchToList()}>Books</Link>
                        <Link to="/book/add">
                            <span className="glyphicon glyphicon-plus"></span>
                        </Link>
                    </div>
                </header>

                <main className="main">
                    <Switch>
                        <Route path="/books" exact render={() => <BookList books={books} enterDetail={(i) => this.switchToDetail(i)}/>}/>
                        <Route path="/book/edit" render={() => <AddEditBook book={currentBook} update={(b) => this.updateLocalBookInfo(b)}/>}/>
                        <Route path="/book/add" render={() => <AddEditBook/>}/>
                        <Route path="/book/detail" render={() => <BookDetail book={currentBook} removeBook={() => this.removeBook()}/>}/>
                        <Redirect to="/books"/>
                    </Switch>
                </main>
                
                {
                    this.props.location.pathname.match(/(add|edit)$/) ? 
                        ''
                        :  
                        <footer className="footer">
                            <Pagination 
                                current={pageIndex}
                                total={pageTotal}
                                preClick={() => this.prePageClick()}
                                nextClick={() => this.nextPageClick()}/>
                        </footer>
                }
            </div>
        );
    }
}

export default withRouter(App);