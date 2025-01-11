import axios from "axios";
import { LOGIN_SUCCESS, LOGOUT } from "../constants/authConstants";
import { Dispatch } from "redux";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8090";

export const login =
  (username: string, password: string) => async (dispatch: Dispatch) => {
    try {
      const { data } = await axios.post("/login", { username, password });

      dispatch({ type: LOGIN_SUCCESS, payload: data });
      sessionStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

export const logout = () => (dispatch: Dispatch) => {
  sessionStorage.removeItem("userInfo");
  dispatch({ type: LOGOUT });
};
