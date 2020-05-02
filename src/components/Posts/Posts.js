import React from 'react';
import Post from './Post';
import { getPosts } from "../../actions";
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';

class Posts extends React.Component {
  state = {
    posts: {
      posts: []
    },
    isFetchingPosts: true   
  }  

  static getDerivedStateFromProps(props, state) {
    if (props.posts.posts !== state.posts.posts) {
      return {
        posts: props.posts.posts,
        isFetchingPosts: props.posts.isFetchingPosts
      }
    } 
    return null;
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.id !== this.props.id) {
  //     this.setState({externalData: null});
  //     this._loadAsyncData(nextProps.id);
  //   }
  // }

  // componentWillUnmount() {
  //   if (this._asyncRequest) {
  //     this._asyncRequest.cancel();
  //   }
  // }

  handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
    // window.location.reload(true);
  }

  handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
    // window.location.reload(true);
  }

  handleDelete = (post, key) => {
    this.props.firebase.ref('posts/' + key).remove();
    // window.location.reload(true);
  }

  render () {
    return (
      <div className="cards">
        {this.state.isFetchingPosts ? (
            <div id="loader">
              <center><Loader style={{ margin:'200px' }} type="Oval" color="#C7CA9A" height={60} width={60}/></center>
            </div>
        ) : (
          <div data-loading={this.state.isFetchingPosts}>
            {this.state.posts.posts ? this.state.posts.posts.map((key, i) => {
              console.log(key);
              return (
                <Post
                  key={key}
                  id={key}
                  post={this.state.posts.posts[i]}
                  onUpvote={this.handleUpvote}
                  onDelete={this.handleDelete}
                  onDownvote={this.handleDownvote}
                />
              )
            }) : null}
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
   posts: state.posts,
   isFetchingPosts: state.isFetchingPosts
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    componentDidMount: () => {
      dispatch(getPosts())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
