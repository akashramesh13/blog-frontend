import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "../constants/authConstants";

interface AuthState {
  loading: boolean;
  userInfo?: {
    username: string;
    id: number;
  };
  error?: string;
}

const initialState: AuthState | any = {
  userInfo: sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo")!)
    : null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, error: undefined };
    case LOGIN_FAILURE:
      return { loading: false, error: action.payload, userInfo: undefined };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
};
