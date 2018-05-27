import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import DEFAULT_COVER from '../assets/default_book_cover.jpg';
import './BookAddEdit.css';
import api from '../common/api';
import { capitalize } from '../common/util';

class AddEditBook extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fetchBook: this.fetchBook.bind(this),
        };
    }

    async fetchBook (id) {
        const book = await api.getBook(id);
        this.setState({
            cover: book.cover || DEFAULT_COVER,
            book,
        });
    }

    async updateCover (e) {
        const file = e.target.files[0];
        this.setState({
            cover: window.URL.createObjectURL(file),
            coverFile: file,
        });
    }

    async submit (e) {
        e.preventDefault();

        const { action, coverFile, book } = this.state;

        // validate params
        if (!book.name || !book.author) {
            const feild = !book.name ? 'Name' : 'Author'; 
            alert(feild + ' is required');
            return;
        }

        // adjust cover value
        const useBook = book;
        if (coverFile) {            
            const res = await api.uploadCover(coverFile);
            useBook.cover = res.coverPath;
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

    updateInputValue (event, field) {
        const { book } = this.state;
        const newBook = {};
        newBook[field] = event.target.value;
        this.setState({ book: Object.assign(book, newBook) });
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
                                onChange={(e) => this.updateCover(e)}
                                ref={e => this.inputElement = e}/>
                        </div>
                        <button className="btn btn-default" 
                            onClick={() => this.inputElement.click()}>
                            Update Book Cover
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
                                    onChange={e => this.updateInputValue(e,  'name')}/>
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
                                    onChange={e => this.updateInputValue(e,  'author')}/>
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
                                    onChange={e => this.updateInputValue(e,  'description')}>
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

    static getDerivedStateFromProps (props, state) { 
        const id = props.match.params.id;       
        const isEdit = !!id;
        if (isEdit) {
            state.fetchBook(id);
        }
        return {
            action: isEdit ? 'edit' : 'add',
            cover: DEFAULT_COVER,
            coverFile: null,
            book: {
                name: '',
                author: '',
                description: '',
            },
        };
    }
}


export default withRouter(AddEditBook);