import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
  SAVE_POST_REQUEST,
  SAVE_POST_SUCCESS,
  SAVE_POST_FAILURE,
  FETCH_CATEGORIES_SUCCESS,
  CLEAR_POSTS,
} from '../redux/constants/postConstants';

export interface IPost {
  id: string | null | undefined;
  title: string;
  content: string;
  coverImage: string | null;
  category: ICategory;
  user: {
    id: string;
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

export interface PostState {
  posts: IPost[];
  post: IPost | null;
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

// Action Interfaces
export interface FetchPostsRequestAction {
  type: typeof FETCH_POSTS_REQUEST;
}

export interface FetchPostsSuccessAction {
  type: typeof FETCH_POSTS_SUCCESS;
  payload: {
    posts: IPost[];
    totalPages: number;
    reset?: boolean;
  };
}

export interface FetchPostsFailureAction {
  type: typeof FETCH_POSTS_FAILURE;
  payload: string;
}

export interface FetchPostRequestAction {
  type: typeof FETCH_POST_REQUEST;
}

export interface FetchPostSuccessAction {
  type: typeof FETCH_POST_SUCCESS;
  payload: IPost;
}

export interface FetchPostFailureAction {
  type: typeof FETCH_POST_FAILURE;
  payload: string;
}

export interface SavePostRequestAction {
  type: typeof SAVE_POST_REQUEST;
}

export interface SavePostSuccessAction {
  type: typeof SAVE_POST_SUCCESS;
  payload: IPost;
}

export interface SavePostFailureAction {
  type: typeof SAVE_POST_FAILURE;
  payload: string;
}

export interface FetchCategoriesSuccessAction {
  type: typeof FETCH_CATEGORIES_SUCCESS;
  payload: ICategory[];
}

export interface ClearPostsAction {
  type: typeof CLEAR_POSTS;
}

export type PostsActionTypes =
  | FetchPostsRequestAction
  | FetchPostsSuccessAction
  | FetchPostsFailureAction
  | FetchPostRequestAction
  | FetchPostSuccessAction
  | FetchPostFailureAction
  | SavePostRequestAction
  | SavePostSuccessAction
  | SavePostFailureAction
  | FetchCategoriesSuccessAction
  | ClearPostsAction;
