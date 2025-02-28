import { ProfileActionTypes, ProfileState } from '../../types/profileTypes';
import { PROFILE_FAILURE, PROFILE_REQUEST, PROFILE_SUCCESS } from '../constants/profileConstants';

const initialState: ProfileState = {
  loading: false,
  id: '',
  username: '',
};

export const profileReducer = (state = initialState, action: ProfileActionTypes): ProfileState => {
  switch (action.type) {
    case PROFILE_REQUEST:
      return { ...state, loading: true };
    case PROFILE_SUCCESS:
      return {
        loading: false,
        id: action.payload.id,
        username: action.payload.username,
      };
    case PROFILE_FAILURE:
      return { ...initialState, loading: false };
    default:
      return state;
  }
};
