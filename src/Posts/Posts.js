import React, { Component, Image } from 'react';
import { GridList } from 'material-ui/GridList';

import Post from './Post';

class Posts extends Component {
  constructor(props) {
    super(props)
  }

  handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
  }

  handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
  }

  render() {
    const posts = Object.keys(this.props.posts).map((key) => {
      return (
        <Post
          key={key}
          id={key}
          post={this.props.posts[key]}
          onUpvote={this.handleUpvote}
          onDownvote={this.handleDownvote}
        />
      )
    });

    return (
      <div style={{ width: '50%', margin: 'auto' }}>
        { this.props.loading ? (
          <div>Loading...</div>
        ) : (
          <div>{posts}</div>
        )}
      </div>
    );
  }
}

export default Posts;
