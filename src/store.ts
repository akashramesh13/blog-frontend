import { createStore, applyMiddleware, combineReducers, Action } from "redux";
import { thunk, ThunkAction } from "redux-thunk";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
