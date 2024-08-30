import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../actions/userActions";

interface UserState {
  loading: boolean;
  userInfo?: any;
  error?: string;
}

const initialState: UserState = {
  loading: false,
};

const userReducer = (state = initialState, action: any): UserState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userReducer;
