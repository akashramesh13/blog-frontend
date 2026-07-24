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
      ? ["system", "light", "dark", "catppuccin"]
      : ["system", "dark", "catppuccin", "light"];

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
      case "catppuccin":
        return (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.43-2.4 1-3.44 0 0-1.82-6.42-.42-7 1.39-.58 4.64.27 6.42 2.26.65-.17 1.33-.26 2-.26z" />
          </svg>
        );
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
    <nav className="navbar">
      <div className="navbar__left">
        <div className="navbar__brand">
          <Link to="/" onClick={closeNavbar}>
            Pixel Pursuit
          </Link>
        </div>
      </div>

      <div className={`navbar__right ${isOpen ? "active" : ""}`}>
        <button
          className="theme-toggle"
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
          className="theme-toggle"
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
