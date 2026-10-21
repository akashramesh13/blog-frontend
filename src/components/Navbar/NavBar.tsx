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
  FiRss,
} from "react-icons/fi";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useAuthCheck } from "../../hooks/useAuthCheck";
import { useTheme } from "../../context/ThemeContext";
import { ThemeMode } from "../../types/theme";
import AvatarImage from "../AvatarImage/AvatarImage";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
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
            <span className="bracket">&lt;</span>Pixel Pursuit<span className="bracket">/&gt;</span>
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

        <a
          href={`${process.env.REACT_APP_BACKEND_URL || "https://blog-backend.akashramesh.in"}/rss.xml`}
          target="_blank"
          rel="noopener noreferrer"
          className="theme-toggle glass-medium glass-interactive"
          title="Subscribe via RSS"
          aria-label="Subscribe via RSS Feed"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          {FiRss({})}
        </a>

        {userInfo && (
          <Link id="add-post" to="/post/new" onClick={handleAddNewPost}>
            Write
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
        <div className={`hamburger ${isOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

