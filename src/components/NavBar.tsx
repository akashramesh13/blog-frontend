import React, { useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { logout } from "../redux/actions/authActions";
import { useDispatch } from "react-redux";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch: any = useDispatch();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">Pixel Pursuit</Link>
      </div>
      <div className={`navbar__links ${isOpen ? "active" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/" onClick={() => dispatch(logout())}>
          Logout
        </Link>
      </div>
      <div className="navbar__toggle" onClick={toggleNavbar}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
