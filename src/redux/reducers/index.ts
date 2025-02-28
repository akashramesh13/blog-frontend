import { combineReducers } from 'redux';
import { authReducer } from './authReducer';

import { postsReducer } from './postsReducer';
import { ProfileState } from '../../types/profileTypes';
import { AuthState } from '../../types/authTypes';
import { PostState } from '../../types/postsTypes';
import { profileReducer } from './profileReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  posts: postsReducer,
});

export type RootState = {
  auth: AuthState;
  profile: ProfileState;
  posts: PostState;
};
