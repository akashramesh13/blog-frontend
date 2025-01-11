import { Dispatch } from "redux";
import axios from "../../helpers/axios";
import { PROFILE_SUCCESS } from "../constants/profileConstants";

export const profile = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await axios.get("/profile");

    dispatch({ type: PROFILE_SUCCESS, payload: data });
    sessionStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.error("Profile load failed!", error);
  }
};
