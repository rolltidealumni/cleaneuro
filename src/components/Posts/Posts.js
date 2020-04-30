import React, { Component } from 'react';
import Post from './Post';
import Loader from 'react-loader-spinner';

class Posts extends Component {
  handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
    window.location.reload(true);
  }

  handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
    window.location.reload(true);
  }

  handleDelete = (post, key) => {
    this.props.firebase.ref('posts/' + key).remove();
    window.location.reload(true);
  }

  render() {
    const _this = this;
    const len = this.props.posts.length-1;
    if (len > 0) {
      this.props.posts.forEach(function(item) {
        if (item.index === len) {
          _this.props.posts[0].leader = 'leader';
        }
      });
    }
    const posts = Object.keys(_this.props.posts).map((key) => {
      return (
        <Post
          key={key}
          id={key}
          post={_this.props.posts[key]}
          onUpvote={this.handleUpvote}
          onDelete={this.handleDelete}
          onDownvote={this.handleDownvote}
        />
      )
    });
    return (
      <div className="cards">
        { this.props.loading ? (
            <div id="loader">
              <center><Loader style={{ margin:'200px' }} type="Oval" color="#C7CA9A" height={60} width={60}/></center>
            </div>
        ) : (
          <div>{posts}</div>
        )}
      </div>
    );
  }
}

export default Posts;
