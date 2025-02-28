import { AuthActionTypes, AuthState } from '../../types/authTypes';
import { LOGIN_SUCCESS, LOGOUT } from '../constants/authConstants';

const initialState: AuthState = {
  loading: false,
  userInfo: JSON.parse(sessionStorage.getItem('userInfo') || 'null'),
  error: undefined,
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      sessionStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };

    case LOGOUT:
      sessionStorage.removeItem('userInfo');
      return { ...state, userInfo: undefined };

    default:
      return state;
  }
};
