import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { getProfile } from "../../redux/actions/profileActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import Loading from "../Loading/Loading";
import "./Profile.scss";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Profile: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, username } = useSelector(
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

      <div className="profile-info">
        <p>
          <strong>Username:</strong> {username}
        </p>
      </div>

      {/* Edit profile functionality coming soon */}
    </div>
  );
};

export default Profile;
