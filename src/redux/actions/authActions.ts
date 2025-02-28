import axios from '../../helpers/axios';
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from '../constants/authConstants';
import { Dispatch } from 'redux';

export const login = (username: string, password: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const { data } = await axios.post('/login', { username, password });
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    sessionStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    console.error('Login failed', error);
    dispatch({
      type: LOGIN_FAILURE,
      payload: 'Invalid username or password!',
    });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    await axios.post('/logout');

    // Dispatch logout action first
    dispatch({ type: LOGOUT });

    // Then clear storage
    sessionStorage.removeItem('userInfo');
    localStorage.removeItem('userInfo');

    // Finally redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    // Still proceed with client-side logout even if API call fails
    dispatch({ type: LOGOUT });
    sessionStorage.removeItem('userInfo');
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  }
};
