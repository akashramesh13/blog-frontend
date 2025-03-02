import { ThunkAction } from "redux-thunk";
import { RootState } from "../reducers";
import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  PROFILE_FAILURE,
} from "../constants/profileConstants";
import { ProfileActionTypes } from "../../types/profileTypes";
import axios from "../../helpers/axios";

export const getProfile =
  (id?: string): ThunkAction<void, RootState, unknown, ProfileActionTypes> =>
  async (dispatch) => {
    try {
      dispatch({ type: PROFILE_REQUEST });

      const { data } = await axios.get(`/profile/${id ?? ""}`);

      dispatch({ type: PROFILE_SUCCESS, payload: data });
    } catch (error) {
      console.error(error);
      dispatch({ type: PROFILE_FAILURE, payload: "Failed to fetch profile" });
    }
  };
