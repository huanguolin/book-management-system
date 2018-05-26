import React from 'react';
import { 
    Route,
    Link,
    Switch,
    Redirect,
} from 'react-router-dom';

import BookList from './BookList';
import BookDetail from './BookDetail';
import AddEditBook from './BookAddEdit';

import './App.css';

export default function () {
    return (
        <div className="wrapper">                
            <header className="header">
                <div className="content">
                    <Link to="/books" >Books</Link>
                    <Link to="/book/add"><span className="glyphicon glyphicon-plus"></span></Link>
                </div>
            </header>

            <main className="main">
                <Switch>
                    <Route path="/books" component={BookList}/>
                    <Route path="/book/:index/detail" component={BookDetail}/>
                    <Route path="/book/:id/edit" component={AddEditBook}/>
                    <Route path="/book/add" component={AddEditBook}/>
                    <Redirect to="/books"/>
                </Switch>
            </main>
        </div>
    );
}
