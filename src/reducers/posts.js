import {
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS
} from "../actions/";

export default (
  state = {
    isFetchingPosts: false,
    posts: []
  },
  action
) => {
  switch (action.type) {
    case FETCH_POSTS:
      return {
        ...state,
        isFetchingPosts: true,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isFetchingPosts: false,
        posts: action.posts
      };
    default:
      return state;
  }
};