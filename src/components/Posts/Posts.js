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
      .orderByChild('submitted')
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
                aperture: child[1].aperture,
                lens: child[1].lens,
                camera: child[1].camera,
                category: child[1].category,
                caption: child[1].caption,
                oneStar: child[1].oneStar,
                twoStars: child[1].twoStars,
                threeStars: child[1].threeStars,
                fourStars: child[1].fourStars,
                fiveStars: child[1].fiveStars,
                total: child[1].total,
                average: (5*child[1].fiveStars + 4*child[1].fourStars + 3*child[1].threeStars + 2*child[1].twoStars + 1*child[1].oneStar) / (child[1].fiveStars+child[1].fourStars+child[1].threeStars+child[1].twoStars+child[1].oneStar)
            });
          });
        }
      });
    if(mounted) setPosts(ordered.sort((a, b) => (a.average < b.average) ? 1 : -1));
    return(ordered);
  }

  useEffect(() => {
    let mounted = true;
    getPosts(mounted);
    return () => mounted = false;
    // eslint-disable-next-line
  }, [posts], props.isVerifying)

  const updateRating = (post, key, rating) => {
    if (rating === 1) {
      console.log('1 star');
      props.firebase.ref('posts/' + key).set({
        imageLink: post.imageLink,
        caption: post.caption,
        aperture: post.aperture,
        lens: post.lens,
        camera: post.camera,
        category: post.category,
        submitted: post.submitted,
        oneStar: post.oneStar + 1,
        twoStars: post.twoStars,
        threeStars: post.threeStars,
        fourStars: post.fourStars,
        fiveStars: post.oneStar,
        total: post.total +1
      });
    } else if (rating === 2) {
      props.firebase.ref('posts/' + key).set({
        imageLink: post.imageLink,
        caption: post.caption,
        submitted: post.submitted,
        aperture: post.aperture,
        lens: post.lens,
        camera: post.camera,
        category: post.category,
        oneStar: post.oneStar,
        twoStars: post.twoStars + 1,
        threeStars: post.threeStars,
        fourStars: post.fourStars,
        fiveStars: post.fiveStars,
        total: post.total +1
      });

    } else if (rating === 3) {
      props.firebase.ref('posts/' + key).set({
        imageLink: post.imageLink,
        caption: post.caption,
        submitted: post.submitted,
        aperture: post.aperture,
        lens: post.lens,
        camera: post.camera,
        category: post.category,
        oneStar: post.oneStar,
        twoStars: post.twoStars,
        threeStars: post.threeStars + 1,
        fourStars: post.fourStars,
        fiveStars: post.fiveStars,
        total: post.total +1
      });
    } else if (rating === 4) {
      props.firebase.ref('posts/' + key).set({
        imageLink: post.imageLink,
        caption: post.caption,
        submitted: post.submitted,
        aperture: post.aperture,
        lens: post.lens,
        camera: post.camera,
        category: post.category,
        oneStar: post.oneStar,
        twoStars: post.twoStars,
        threeStars: post.threeStars,
        fourStars: post.fourStars + 1,
        fiveStars: post.fiveStars,
        total: post.total +1
      });
    } else if (rating === 5) {
      props.firebase.ref('posts/' + key).set({
        imageLink: post.imageLink,
        caption: post.caption,
        submitted: post.submitted,
        aperture: post.aperture,
        lens: post.lens,
        camera: post.camera,
        category: post.category,
        oneStar: post.oneStar,
        twoStars: post.twoStars,
        threeStars: post.threeStars,
        fourStars: post.fourStars,
        fiveStars: post.fiveStars + 1,
        total: post.total +1
      });
    }
  }

  return (
    <div className="cards">
      {props.isVerifying ? (
      <div id="loader">
        <center><Loader style={{ margin:'200px' }} type="Oval" color="#61dbfb" height={60} width={60}/></center>
      </div> ) : (
      <div>
        {posts.length > 0 ? posts.map((post, i) => {
          return (<Post
            showZoomModal={(image) => props.showZoomModal(image)}
            isAuthenticated={props.isAuthenticated}
            key={i}
            id={i}
            post={post}
            updateRating={(post, i, rating) => updateRating(post, post.key, rating)}
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
