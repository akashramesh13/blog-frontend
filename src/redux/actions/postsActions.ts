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
} from "../constants/postConstants";
import { ICategory, IPost } from "../../types/postsTypes";

export const fetchPosts =
  (page = 0, size = 5, category: string | null = null, reset = false) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_POSTS_REQUEST });

    try {
      let url = `/posts/?page=${page}&size=${size}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const { data } = await axios.get(url);
      dispatch({
        type: FETCH_POSTS_SUCCESS,
        payload: { posts: data.content, totalPages: data.totalPages, reset },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: FETCH_POSTS_FAILURE,
        payload: "Error fetching posts",
      });
    }
  };

export const addCategory =
  (categoryName: string) => async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.post("/category/", { name: categoryName });

      dispatch({ type: "ADD_CATEGORY_SUCCESS", payload: data });
    } catch (error) {
      dispatch({
        type: "ADD_CATEGORY_FAILURE",
        payload: "Failed to add category",
      });
    }
  };

export const fetchPost = (postId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_POST_REQUEST });

  try {
    const { data } = await axios.get(`/posts/${postId}`);
    dispatch({ type: FETCH_POST_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);

    dispatch({
      type: FETCH_POST_FAILURE,
      payload: "Error fetching post",
    });
  }
};

export const deletePost = (postId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_POST_REQUEST });

  try {
    const { data } = await axios.delete(`/posts/${postId}`);
    dispatch({ type: FETCH_POST_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);

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
  (post: IPost, postId?: string) => async (dispatch: Dispatch) => {
    dispatch({ type: SAVE_POST_REQUEST });

    try {
      const { data } = postId
        ? await axios.put(`/posts/${postId}`, post)
        : await axios.post("/posts", post);

      dispatch({ type: SAVE_POST_SUCCESS, payload: data });
    } catch (error) {
      console.log(error);

      dispatch({ type: SAVE_POST_FAILURE, payload: "Error saving post" });
    }
  };

export const clearPosts = () => ({ type: CLEAR_POSTS });
