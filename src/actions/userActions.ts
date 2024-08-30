import axios from "axios";
import { Dispatch } from "redux";
import { AppThunk } from "../store";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

const BASE_URL = "http://localhost:8080";

export const loginUser =
  (username: string, password: string): AppThunk =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });

      const { data } = await axios.post(`${BASE_URL}/api/users/login`, {
        username,
        password,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error,
      });
    }
  };
