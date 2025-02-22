import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { profileReducer } from "./profileReducer";
import { postsReducer } from "./postsReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  posts: postsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
