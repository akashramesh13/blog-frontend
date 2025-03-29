import {
  PROFILE_FAILURE,
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
} from "../redux/constants/profileConstants";

export interface ProfileState {
  loading: boolean;
  id?: string;
  username?: string;
}

export interface ProfileRequestAction {
  type: typeof PROFILE_REQUEST;
}

export interface ProfileSuccessAction {
  type: typeof PROFILE_SUCCESS;
  payload: {
    id: string;
    username: string;
  };
}

export interface ProfileFailureAction {
  type: typeof PROFILE_FAILURE;
}

export type ProfileActionTypes =
  | ProfileRequestAction
  | ProfileSuccessAction
  | ProfileFailureAction;
