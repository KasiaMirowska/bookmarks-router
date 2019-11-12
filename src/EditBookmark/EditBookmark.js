import React from 'react';
import config from '../config';

export default class EditBookmarkForm extends React.Component {
    state = {
        id: null,
        title: '',
        url: '',
        description: '',
        rating: 1,
        error: null,
    }
    setBookmark = (bookmark) => {
        this.setState({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            rating: bookmark.rating,
        })
        console.log(this.state)
    }
    componentDidMount() {
        const bookmarksId = this.props.match.params.id;
        fetch(config.API_ENDPOINT + `/${bookmarksId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData)
                this.setBookmark(resData);
            })
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        });
    }
    handleUrlChange = (e) => {
        this.setState({
            url: e.target.value
        })
    }
    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })
    }
    handleRatingChange = (e) => {
        this.setState({
            rating: Number(e.target.value)
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        let { title, url, description, rating } = this.state;
        const updatedBookmark = {
            title,
            url,
            description,
            rating,
        }
        this.setState({ error: null })
        const bookmarksId = this.props.match.params.id;
        fetch(config.API_ENDPOINT + `/${bookmarksId}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedBookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    console.log('HERE!, res')
                    return res.json().then(error => {
                        throw error
                    })
                }
                console.log(res.json())
                return res.json()
            })
            .then(resData => {
                title = ''
                url = ''
                description = ''
                rating = ''
                console.log(resData, 'HERE!!!!!')
                this.context.updateBookmark(resData)
                this.props.history.push('/')
            })
            .catch(err => {
                this.setState({
                    error: err.message,
                })
            })
    }

    render() {
        const { id, url, description, rating, error } = this.state;
        return (
            <div>
                <h2>Bookmark id:{id}</h2>
                <form className='edit-form' onSubmit={this.handleFormSubmit}>
                    <div className='AddBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                        {' '}
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            // required
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            placeholder='https://www.great-website.com/'
                            required
                            value={url}
                            onChange={this.handleUrlChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        {' '}
                        <textarea
                            name='description'
                            id='description'
                            value={description}
                            onChange={this.handleDescriptionChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                        {' '}
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            min='1'
                            max='5'
                            required
                            value={rating}
                            onChange={this.handleRatingChange}
                        />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        )
    }
}