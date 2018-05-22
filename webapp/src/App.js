import React, { Component } from 'react';
import { 
    Route,
    Link,
    Switch,
} from 'react-router-dom';

// global style
import 'bootstrap-css-only/css/bootstrap.min.css';
import './App.css';

// components
import BookList from './components/BookList';
import AddEditBook from './components/AddEditBook';

export default class App extends Component {

    constructor () {
        super();
        this.state = {
            page: {
                current: 1,
                total: 1,
            }
        };
    }
    
    render () {
        const page = this.state.page;

        const header = (
            <header className="header">
                <div className="content">
                    <Link to="/">Books</Link>
                    <Link to="/addbook">
                        <span className="glyphicon glyphicon-plus"></span>
                    </Link>
                </div>
            </header>
        );
        const footer = (
            <footer className="footer">
                <ul className="my-pager">
                    <li className={page.current === 1 ? 'disabled' : ''} >
                        previous
                    </li>
                    <li>{ page.total === -1 ? '...' : (page.current + '/' + page.total) }</li>
                    <li className={page.current === page.total ? 'disabled' : ''} >
                        next
                    </li>
                </ul>
            </footer>
        );

        return (
            <div className="wrapper">
                {header}

                <main className="main">
                    <Switch>
                        <Route path="/" component={BookList}/>
                        <Route path="/addbook" component={AddEditBook}/>
                    </Switch>
                </main>

                {footer}
            </div>
        );
    }
}

