import axios from "../../helpers/axios";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../constants/authConstants";
import { Dispatch } from "redux";

export const login =
  (username: string, password: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const { data } = await axios.post("/login", { username, password });

      dispatch({ type: LOGIN_SUCCESS, payload: data });
      sessionStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.error("Login failed", error);
      dispatch({
        type: LOGIN_FAILURE,
        payload: "Invalid username or password!",
      });
    }
  };

export const logout = () => async (dispatch: Dispatch) => {
  sessionStorage.clear();
  try {
    await axios.post("/logout");
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("userInfo");
    window.location.reload();
  } catch (error) {
    console.error("Logout failed:", error);
  }

  dispatch({ type: LOGOUT });
  window.location.href = "/";
};
