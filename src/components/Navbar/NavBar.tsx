import React, { useState, useEffect, useRef } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { CgProfile } from "react-icons/cg";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const handleLogout = async () => {
    await dispatch(logout());
    closeNavbar();
  };

  const handleProfileOnClick = () => {
    setIsProfileDropDownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="profile-menu" ref={profileRef}>
            {CgProfile({
              className: "profile-icon",
              onClick: handleProfileOnClick,
            })}
            {isProfileDropDownOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileDropDownOpen(false)}
                >
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
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
