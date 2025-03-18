import { PostsActionTypes, PostState } from "../../types/postsTypes";
import {
  CLEAR_POSTS,
  CLEAR_CURRENT_POST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_POST_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  SAVE_POST_FAILURE,
  SAVE_POST_REQUEST,
  SAVE_POST_SUCCESS,
} from "../constants/postConstants";

const initialState: PostState = {
  posts: [],
  post: null,
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
};

export const postsReducer = (
  state = initialState,
  action: PostsActionTypes
): PostState => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case FETCH_POST_REQUEST:
    case SAVE_POST_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload.reset
          ? action.payload.posts
          : [...state.posts, ...action.payload.posts],
        totalPages: action.payload.totalPages,
        loading: false,
      };

    case FETCH_POST_SUCCESS:
      return { ...state, post: action.payload, loading: false };

    case SAVE_POST_SUCCESS:
      return { ...state, post: action.payload, loading: false };

    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload };

    case FETCH_POSTS_FAILURE:
    case FETCH_POST_FAILURE:
    case SAVE_POST_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case CLEAR_POSTS:
      return { ...state, posts: [], post: null, totalPages: 1 };

    case CLEAR_CURRENT_POST:
      return { ...state, post: null };

    default:
      return state;
  }
};
