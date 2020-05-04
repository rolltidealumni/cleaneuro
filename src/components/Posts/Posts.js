import React, { useState, useEffect } from 'react';
import realTime from '../../firebase/firebase';
import Post from './Post';
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';

const Posts = (props) => {
  let postz = [];
  let ordered = [];
  const [posts, setPosts] = useState([]);
  
  const getPosts = async (mounted) => {
    await realTime
      .ref('posts')
      .orderByChild('upvote')
      .on("value", (snapshot) => {
        if(snapshot.val()) {
          postz.push(snapshot.val());  
          let keys = Object.keys(postz[0]);
          var result = Object.keys(postz[0]).map(function (key) { 
            return [Number(key), postz[0][key]]; 
          }); 
          result.forEach(function(child, i) {
              ordered.push({
                index: i,
                key: keys[i],
                submitted: child[1].submitted,
                imageLink: child[1].imageLink,
                upvote: child[1].upvote,
                caption: child[1].caption,
                downvote: child[1].downvote,
            });
          });
        }
      });
    if(mounted) setPosts(ordered.sort((a, b) => (a.upvote < b.upvote) ? 1 : -1));
    return(ordered);
  }

  useEffect(() => {
    let mounted = true;
    getPosts(mounted);
    return () => mounted = false;
    // eslint-disable-next-line
  }, [posts])

  const handleUpvote = (post, key) => {
    props.firebase.ref('posts/' + key).set({
      imageLink: post.imageLink,
      caption: post.caption,
      submitted: post.submitted,
      upvote: post.upvote + 1,
      downvote: post.downvote
    });
  }

  const handleDownvote = (post, key) => {
    props.firebase.ref('posts/' + key).set({
      imageLink: post.imageLink,
      caption: post.caption,
      submitted: post.submitted,
      upvote: post.upvote,
      downvote: post.downvote + 1
    });
  }

  const handleDelete = (post, key) => {
    props.firebase.ref('posts/' + key).remove();
  }

  return (
    <div className="cards">
      {props.isVerifying ? (
      <div id="loader">
        <center><Loader style={{ margin:'200px' }} type="Oval" color="#C7CA9A" height={60} width={60}/></center>
      </div> ) : (
      <div>
        {posts.length > 0 ? posts.map((post, i) => {
          return (<Post
            isAuthenticated={props.isAuthenticated}
            key={i}
            id={i}
            post={post}
            onUpvote={(post, key) => handleUpvote(post, post.key)}
            onDelete={(post, key) => handleDelete(post, post.key)}
            onDownvote={(post, key) => handleDownvote(post, post.key)}
          />)
        }) : null }
      </div>
      )}
    </div>
  )
} 

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying
  };
}

export default connect(mapStateToProps)(Posts);
