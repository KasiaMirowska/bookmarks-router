import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import BookmarksContext from './BookmarksContext';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import EditBookmarkForm from './EditBookmark/EditBookmark';
import Nav from './Nav/Nav';
import config from './config';
import './App.css';


class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };


  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark],
    })
  }

  deleteBookmark = (bookmarkId) => {
    const newBookmarks = this.state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
    this.setState({
      bookmarks: newBookmarks,
    })
  }

  editBookmark = (updatedBookmark) => {
    const newBookmarks = this.state.bookmarks.map(b => (b.id === updatedBookmark.id)? updatedBookmark: b)
    this.setState({
      bookmarks: newBookmarks,
    })
  }
  
  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(responseData => {
        console.log(responseData)
        this.setBookmarks(responseData)})
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue} >
        <Nav />
        <div className='content' aria-live='polite'>
          <Route
            path='/add-bookmark'
            component={AddBookmark}
          />
          <Route 
            path = '/edit/:id'
            component = {EditBookmarkForm}
          />
          <Route exact path='/'
            component={ BookmarkList }
          />
        </div>
        </BookmarksContext.Provider>  
      </main>
    );
  }
}

export default App;
