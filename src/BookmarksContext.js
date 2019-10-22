import React from 'react';
import AddBookmark from './AddBookmark/AddBookmark';
import PropTypes from 'prop-types';


const BookmarksContext = React.createContext({
    bookmarks: [],
    AddBookmark: () => {},
    deleteBookmark: () => {},
})

export default BookmarksContext
