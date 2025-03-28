import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "../redux/constants/authConstants";

export interface AuthState {
  loading: boolean;
  userInfo?: {
    username: string;
    id: string;
  };
  error?: string;
}

export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    username: string;
    id: string;
  };
}

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: {
    username: string;
    id: string;
  };
}

export interface RegisterFailureAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | LogoutAction;
