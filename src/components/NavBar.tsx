import React, { useState, useEffect, useRef } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { logout } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();
  const navbarRef: any = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar__brand">
        <Link to="/">Pixel Pursuit</Link>
      </div>
      <div className={`navbar__links ${isOpen ? "active" : ""}`}>
        <Link to="/home" onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/about" onClick={handleLinkClick}>
          About
        </Link>
        <Link to="/contact" onClick={handleLinkClick}>
          Contact
        </Link>
        <Link
          to="/"
          onClick={() => {
            dispatch(logout());
            handleLinkClick();
          }}
        >
          Logout
        </Link>
      </div>
      <div className="navbar__toggle" onClick={toggleNavbar}>
        ☰
      </div>
    </nav>
  );
};

export default NavBar;
