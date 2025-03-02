import axios from "../../helpers/axios";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "../constants/authConstants";
import { Dispatch } from "redux";
import { History } from "history";

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
  try {
    await axios.post("/logout");

    dispatch({ type: LOGOUT });

    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("userInfo");

    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    dispatch({ type: LOGOUT });
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  }
};

export const register =
  (username: string, password: string, history: History<unknown>) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: REGISTER_REQUEST });

      const { data } = await axios.post("/register", { username, password });

      dispatch({ type: REGISTER_SUCCESS, payload: data });

      history.push("/");
    } catch (error) {
      console.error("Registration failed", error);
      dispatch({
        type: REGISTER_FAILURE,
        payload: "Registration failed!",
      });
    }
  };
