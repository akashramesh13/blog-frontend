import React, { useState, useEffect, useRef } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { logout } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();

  // Get login state from Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Get the current location (page)
  const location = useLocation();

  const navbarRef: any = useRef(null);

  useEffect(() => {
    // This effect will trigger every time userInfo changes
    // So the Navbar will automatically re-render when login/logout state changes
  }, [userInfo]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("userInfo");
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar__left">
        <div className="navbar__brand">
          <Link to="/">Pixel Pursuit</Link>
        </div>
        <div className={`navbar__links ${isOpen ? "active" : ""}`}>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div className="navbar__right">
        {/* Only show Login and Register if we're not on those pages */}
        {
          <>
            {userInfo ? (
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            ) : (
              <>
                {location.pathname !== "/login" && (
                  <Link to="/login">Login</Link>
                )}
                {location.pathname !== "/register" && (
                  <Link to="/register">Register</Link>
                )}
              </>
            )}
          </>
        }
      </div>

      <div className="navbar__toggle" onClick={toggleNavbar}>
        ☰
      </div>
    </nav>
  );
};

export default NavBar;
