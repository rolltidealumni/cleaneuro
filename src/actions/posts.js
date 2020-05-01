import realTime from '../firebase/firebase';
export const FETCH_POSTS = "FETCH_POSTS";
export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS";

const fetchPosts = () => {
  return {
    type: FETCH_POSTS
  };
};

const receivePosts = posts => {
  return {
    type: FETCH_POSTS_SUCCESS,
    posts
  };
};

export const getPosts = () => dispatch => {
  dispatch(fetchPosts());
  let postz = [];
  let ordered = [];
  async function r() {
    let promise = new Promise((resolve, reject) => {
      realTime
      .ref('posts')
      .orderByChild('upvote')
      .on("value", (snapshot) => {
        postz.push(snapshot.val());  
        let keys = Object.keys(postz[0]);
        var result = Object.keys(postz[0]).map(function (key) { 
          return [Number(key), postz[0][key]]; 
        }); 
        result.forEach(function(child, i) {
            ordered.push({
              index: i,
              key: keys[i],
              instagramLink: child[1].instagramLink,
              upvote: child[1].upvote,
              downvote: child[1].downvote,
          });
        });
      });
      resolve(ordered);
    });

    let result = await promise;
    ordered.sort((a, b) => (a.upvote < b.upvote) ? 1 : -1);
    dispatch(receivePosts(ordered));
  }; r();
};