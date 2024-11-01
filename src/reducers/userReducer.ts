// userReducer.ts
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../actions/userActions";

interface UserInfo {
  isAuthenticated: boolean;
  userId: string;
}

export interface UserState {
  loading: boolean;
  userInfo?: UserInfo;
  error?: string;
}

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;

const initialState: UserState = {
  loading: false,
  userInfo: userInfoFromStorage,
};

const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Store in localStorage
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
      };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
