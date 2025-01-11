import {
  PROFILE_FAILURE,
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
} from "../constants/profileConstants";

interface ProfileState {
  loading: boolean;
  username: string;
}

const initialState: ProfileState | any = {};

export const profileReducer = (
  state = initialState,
  action: any
): ProfileState => {
  switch (action.type) {
    case PROFILE_REQUEST:
      return { ...state, loading: true };
    case PROFILE_SUCCESS:
      return { loading: false, username: action.payload.username };
    case PROFILE_FAILURE:
      return { loading: false, username: "" };
    default:
      return state;
  }
};
