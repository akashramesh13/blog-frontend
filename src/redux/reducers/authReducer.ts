import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../constants/authConstants";

import { AuthActionTypes, AuthState } from "../../types/authTypes";

const initialState: AuthState = {
  loading: false,
  userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
  error: undefined,
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return { ...state, loading: true, error: undefined };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        userInfo: action.payload,
        error: undefined,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...state, userInfo: undefined, error: undefined };

    default:
      return state;
  }
};
