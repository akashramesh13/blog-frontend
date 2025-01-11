export interface AuthState {
  isLoggedIn: boolean;
  username: string;
}

export interface LoginAction {
  type: "LOGIN";
  payload: {
    username: string;
  };
}

export interface LogoutAction {
  type: "LOGOUT";
}

export type AuthActionTypes = LoginAction | LogoutAction;
