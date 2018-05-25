import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './AddEditBook.css';
import api from '../api';
import { capitalize } from '../util';

class AddEditBook extends Component {
    constructor (props) {
        super(props);
        const state = {
            action: 'add',
            cover: DEFAULT_COVER,
            book: {
                name: '',
                author: '',
                description: '',
            },
        };
        const book = props.book;
        if (book) {
            state.action = 'edit';
            state.cover = book.cover || DEFAULT_COVER;
            state.book = Object.assign({}, book);
        }
        this.state = state;
    }

    async uploadCover (e) {
        const file = e.target.files[0];
        const res = await api.uploadCover(file);
        this.setState({
            cover: res.coverPath,
        });
    }

    async submit (e) {
        e.preventDefault();

        const { action, cover, book } = this.state;

        // validate params
        if (!book.name || !book.author) {
            const feild = !book.name ? 'Name' : 'Author'; 
            alert(feild + ' is required');
            return;
        }

        // adjust cover value
        const useBook = book;
        if (cover === 'img/default_book_cover.jpg') {
            useBook.cover = '';
        } else {
            useBook.cover = cover ;
        }

        // do real thing 
        if (action === 'add') {
            await api.addBook(useBook);
            alert('add book successfully!');
            this.props.history.push('/books');
        } else {
            const newBook = await api.updateBook(useBook);
            if (typeof this.props.update === 'function') {
                this.props.update(newBook);
            }
            alert('update book successfully!');
            this.props.history.goBack();
        }
    }

    render () {
        const { action, cover, book } = this.state;

        return (
            <div className="add-edit-book container">

                <h4 className="title">{capitalize(action)} Book</h4>

                <div className="row">        
                    <div className="col-sm-4 pic">
                        <div className="pre-view">
                            <img src={cover} alt="default cover" />
                            <input type="file" 
                                id="coverUpload"
                                accept="image/jpg, image/jpeg, image/png"
                                onChange={(e) => this.uploadCover(e)}
                                ref={e => this.inputElement = e}/>
                        </div>
                        <button className="btn btn-default" 
                            onClick={() => this.inputElement.click()}>
                            Upload Book Cover
                        </button>
                    </div>
                    
                    <form className="col-sm-8 form-horizontal">
                    
                        <div className="form-group">
                            <label htmlFor="inputBookName" className="col-sm-3 control-label">Name</label>
                            <div className="col-sm-9">
                                <input type="text" 
                                    className="form-control" 
                                    id="inputBookName" 
                                    placeholder="Name"
                                    maxLength="128"
                                    value={book.name}
                                    onChange={e => this.setState({book: Object.assign(book, {name: e.target.value})})}/>
                            </div>
                        </div>
                
                        <div className="form-group">
                            <label htmlFor="inputBookAuthor" className="col-sm-3 control-label">Author</label>
                            <div className="col-sm-9">
                                <input type="text" 
                                    className="form-control" 
                                    id="inputBookAuthor" 
                                    placeholder="Author"
                                    maxLength="128"
                                    value={book.author}
                                    onChange={e => this.setState({book: Object.assign(book, {author: e.target.value})})}/>
                            </div>
                        </div>
                
                        <div className="form-group">
                            <label htmlFor="inputBookDescription" className="col-sm-3 control-label">Description</label>
                            <div className="col-sm-9">
                                <textarea className="form-control" 
                                    rows="10" 
                                    id="inputBookDescription" 
                                    placeholder="Description"
                                    maxLength="1024"
                                    value={book.description}
                                    onChange={e => this.setState({book: Object.assign(book, {description: e.target.value})})}>
                                </textarea>
                            </div>
                        </div>
                
                        <div className="form-group submit">
                            <div className="col-sm-offset-3 col-sm-2">
                                <button type="submit" 
                                    className="btn btn-primary" 
                                    onClick={e => this.submit(e)}>
                                    submit
                                </button>
                            </div>
                        </div>
                
                    </form>
                </div>
            </div>
        );
    }
}


export default withRouter(AddEditBook);