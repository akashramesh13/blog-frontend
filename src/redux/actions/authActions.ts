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

      // Store in localStorage instead of sessionStorage for cross-tab persistence
      localStorage.setItem("userInfo", JSON.stringify(data));
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
    
    // Clear storage
    localStorage.removeItem("userInfo");
    
    // Dispatch logout action
    dispatch({ type: LOGOUT });

    // Redirect to home page
    window.location.href = "/";
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if the API call fails, we should still logout locally
    localStorage.removeItem("userInfo");
    dispatch({ type: LOGOUT });
    window.location.href = "/";
  }
};

export const register =
  (username: string, password: string, history: History<unknown>) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: REGISTER_REQUEST });

      await axios.post("/register", { username, password });

      dispatch({ type: REGISTER_SUCCESS });

      // Redirect to login page after successful registration
      history.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
      dispatch({
        type: REGISTER_FAILURE,
        payload: "Registration failed!",
      });
    }
  };
