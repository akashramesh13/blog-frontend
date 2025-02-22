import React, { useState } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    closeNavbar();
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <div className="navbar__brand">
          <Link to="/" onClick={closeNavbar}>
            Pixel Pursuit
          </Link>
        </div>
        <div className={`navbar__links ${isOpen ? "active" : ""}`}>
          <Link to="/home" onClick={closeNavbar}>
            Home
          </Link>
        </div>
      </div>

      <div className={`navbar__right ${isOpen ? "active" : ""}`}>
        {userInfo && (
          <Link to="/post/new" onClick={closeNavbar}>
            <span id="add-post">+ Add new post</span>
          </Link>
        )}
        {userInfo ? (
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login" onClick={closeNavbar}>
                Login
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" onClick={closeNavbar}>
                Register
              </Link>
            )}
          </>
        )}
      </div>

      <div className="navbar__toggle" onClick={toggleNavbar}>
        ☰
      </div>
    </nav>
  );
};

export default NavBar;
