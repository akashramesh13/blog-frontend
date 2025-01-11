// src/redux/reducers/index.ts
import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { profileReducer } from "./profileReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
