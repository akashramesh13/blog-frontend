import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { getProfile } from "../../redux/actions/profileActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Loading from "../Loading/Loading";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Profile: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, id, username } = useSelector(
    (state: RootState) => state.profile
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const isOwnProfile = !profileId || profileId === userInfo?.id;

  useEffect(() => {
    dispatch(getProfile(profileId));
  }, [dispatch, profileId]);

  if (loading) return <Loading />;

  return (
    <div className="profile-container">
      <h1>{isOwnProfile ? "My Profile" : `${username}'s Profile`}</h1>

      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>User ID:</strong> {id}
      </p>

      {isOwnProfile && <button>Edit Profile</button>}
    </div>
  );
};

export default Profile;
