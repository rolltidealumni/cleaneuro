import React, { Component, useState, useEffect } from 'react';
import { connect } from "react-redux";
import Post from './Post';
import Loader from 'react-loader-spinner';

function Posts (props) {
  const { dispatch, posts, isFetchingPosts } = props;
  const [localPosts, setLocalPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [instagramLink, setInstagramLink] = useState("");
  const [isValid, setIsValid] = useState(true);
  let Posts = {};

  useEffect(() => {
    console.log(posts.posts);
    Posts = posts.posts.map((key) => 
      console.log(key));  
    // <Post
      //   key={key}
      //   id={key}
      //   post={posts[key]}
      //   onUpvote={this.handleUpvote}
      //   onDelete={this.handleDelete}
      //   onDownvote={this.handleDownvote}
      // />);
      console.log(Posts);
  }, props.posts.posts);

  const handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
    // window.location.reload(true);
  }

  const handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      instagramLink: post.instagramLink,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
    // window.location.reload(true);
  }

  const handleDelete = (post, key) => {
    this.props.firebase.ref('posts/' + key).remove();
    // window.location.reload(true);
  }

  const len = posts.length-1;
  if (len > 0) {
    posts.forEach(function(item) {
      if (item.index === len) {
        posts[0].leader = 'leader';
      }
    });
  }

  return (
    <div className="cards">
      {props.loading ? (
          <div id="loader">
            <center><Loader style={{ margin:'200px' }} type="Oval" color="#C7CA9A" height={60} width={60}/></center>
          </div>
      ) : (
        <div>
         {/* {Posts} */}
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
   posts: state.posts,
   isFetchingPosts: state.isFetchingPosts
  };
}

export default connect(mapStateToProps)(Posts);
