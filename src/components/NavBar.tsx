import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers";
import { logout } from "../redux/actions/authActions";

const Navbar: React.FC = () => {
  const dispatch: any = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <h1>My Blog</h1>
      {userInfo ? (
        <div>
          <span>{userInfo.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <span>Login</span>
      )}
    </nav>
  );
};

export default Navbar;
