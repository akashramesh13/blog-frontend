import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home: React.FC = () => {
  const isAuthenticated = useSelector((state: any) => {
    console.log("state: ", state);
    return state.user.userInfo.isAuthenticated;
  });
  return <div>Home: {isAuthenticated ? "Logged in!!" : "Not Logged in"}</div>;
};

export default Home;
