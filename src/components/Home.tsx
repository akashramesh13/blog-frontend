import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { useDispatch } from "react-redux";
import { profile } from "../redux/actions/profileActions";

const Home: React.FC = () => {
  const username = useSelector((state: RootState) => state.profile.username);
  const dispatch: any = useDispatch();
  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(profile());
    };
    fetchProfile();
  }, []);
  return (
    <>
      <div>Welcome to the Home Page {username}!</div>
    </>
  );
};

export default Home;
