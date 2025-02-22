import { Dispatch } from "redux";
import axios from "../../helpers/axios";
import {
  CLEAR_POSTS,
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
} from "../actions/postsActions";

export interface IPost {
  id: number;
  title: string;
  content: string;
  category: ICategory;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  owner: boolean;
}

export interface ICategory {
  id: number;
  name: string;
}

interface PostState {
  posts: IPost[];
  post: IPost | null;
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: PostState = {
  posts: [],
  post: null,
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
};

export const postsReducer = (state = initialState, action: any): PostState => {
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

    default:
      return state;
  }
};

export const fetchPosts =
  (page = 0, size = 5, category: string | null = null, reset = false) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_POSTS_REQUEST });

    try {
      let url = `/posts/?page=${page}&size=${size}`;
      if (category) {
        url += `&category=${category}`;
      }

      const { data } = await axios.get(url);
      dispatch({
        type: FETCH_POSTS_SUCCESS,
        payload: { posts: data.content, totalPages: data.totalPages, reset },
      });
    } catch (error) {
      dispatch({
        type: FETCH_POSTS_FAILURE,
        payload: "Error fetching posts",
      });
    }
  };

export const fetchPost = (postId: number) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_POST_REQUEST });

  try {
    const { data } = await axios.get(`/posts/${postId}`);
    dispatch({ type: FETCH_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_POST_FAILURE,
      payload: "Error fetching post",
    });
  }
};

export const fetchCategories = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await axios.get<ICategory[]>("/category/");
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error fetching categories", error);
  }
};

export const savePost =
  (post: IPost, postId?: number) => async (dispatch: Dispatch) => {
    dispatch({ type: SAVE_POST_REQUEST });

    try {
      const { data } = postId
        ? await axios.put(`/posts/${postId}`, post)
        : await axios.post("/posts", post);

      dispatch({ type: SAVE_POST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: SAVE_POST_FAILURE, payload: "Error saving post" });
    }
  };

export const clearPosts = () => ({ type: CLEAR_POSTS });
