import React, { useState, useEffect, useRef } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { clearCurrentPost } from "../../redux/actions/postsActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { CgProfile } from "react-icons/cg";
import {
  FiSun,
  FiMoon,
  FiMonitor,
} from "react-icons/fi";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { useTheme } from "../../context/ThemeContext";
import { ThemeMode } from "../../types/theme";
import AvatarImage from "../AvatarImage/AvatarImage";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  useAuthCheck();

  const { themeMode, setThemeMode } = useTheme();

  const cycleTheme = () => {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const themeCycle: ThemeMode[] = isSystemDark
      ? ["system", "light", "dark"]
      : ["system", "dark", "light"];

    const currentIndex = themeCycle.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    setThemeMode(themeCycle[nextIndex]);
  };

  const themeIcon = () => {
    switch (themeMode) {
      case "light":
        return FiSun({});
      case "dark":
        return FiMoon({});
      default:
        return FiMonitor({});
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("menu-open");
  };

  const closeNavbar = () => {
    setIsOpen(false);
    document.body.classList.remove("menu-open");
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setIsLogoutModalOpen(false);
    closeNavbar();
  };

  const handleProfileOnClick = () => {
    setIsProfileDropDownOpen((prev) => !prev);
  };

  const handleAddNewPost = () => {
    dispatch(clearCurrentPost());
    closeNavbar();
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
    <nav className="navbar glass-high">
      <div id="scroll-progress"></div>
      <div className="navbar__left">
        <div className="navbar__brand">
          <Link to="/" onClick={closeNavbar}>
            Pixel Pursuit
          </Link>
        </div>
      </div>

      <div className={`navbar__right ${isOpen ? "active" : ""}`}>
        <button
          className="theme-toggle glass-medium glass-interactive"
          onClick={cycleTheme}
          title={`Theme: ${themeMode}`}
          aria-label={`Current theme: ${themeMode}. Click to change.`}
        >
          {themeIcon()}
        </button>

        {userInfo && (
          <Link id="add-post" className="navbar__write-btn" to="/post/new" onClick={handleAddNewPost}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Write</span>
          </Link>
        )}

        {userInfo ? (
          <div className="profile-menu" ref={profileRef}>
            <AvatarImage
              avatarString={userInfo.avatar}
              size={36}
              className="navbar-avatar"
              onClick={handleProfileOnClick}
              fallback={CgProfile({
                className: "profile-fallback-icon",
              })}
            />
            {isProfileDropDownOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/profile"
                  onClick={() => {
                    setIsProfileDropDownOpen(false);
                    closeNavbar();
                  }}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropDownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                >
                  Logout
                </button>
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
        <div className={`hamburger ${isOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
      />
    </nav>
  );
};

export default NavBar;

