import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import { Link, useLocation, useHistory } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { clearCurrentPost } from "../../redux/actions/postsActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { FiSearch } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useAuthCheck } from "../../hooks/useAuthCheck";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const history = useHistory();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inlineSearchQuery, setInlineSearchQuery] = useState("");

  const handleInlineSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      history.push(`/?search=${encodeURIComponent(inlineSearchQuery)}`);
      setIsSearchOpen(false);
      setInlineSearchQuery("");
    }
  };

  const handleMenuSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      history.push(`/?search=${encodeURIComponent(menuSearchQuery)}`);
      closeNavbar();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isArticlePage = window.location.pathname.startsWith("/post/view");
      const threshold = isArticlePage ? window.innerHeight - 100 : 150;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsSearchOpen(false);
        document.body.classList.remove("menu-open");
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useAuthCheck();

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

  const handleAddNewPost = () => {
    dispatch(clearCurrentPost());
    closeNavbar();
  };

  const isArticlePage = location.pathname.startsWith("/post/view");
  const navClasses = `navbar ${isArticlePage ? 'navbar--article' : ''} ${isArticlePage && !isScrolled && !isOpen ? 'navbar--transparent' : ''} ${isScrolled ? 'navbar--scrolled' : ''}`;

  return (
    <nav className={navClasses}>
      <div className="navbar__left">
        <div className="navbar__menu-container">
          <div className="navbar__menu-top">
            <span className="navbar__menu-text" onClick={toggleNavbar}>
              {isOpen ? "✕ CLOSE" : "MENU"}
            </span>
            {!isOpen && <span className="navbar__menu-separator">/</span>}
            {!isOpen && (
              <span onClick={() => setIsSearchOpen(!isSearchOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {isSearchOpen ? "✕" : FiSearch({ className: "navbar__search-icon" }) as any}
              </span>
            )}
          </div>
          <div className="navbar__menu-bottom">
            <a href="https://github.com/akashramesh13" target="_blank" rel="noopener noreferrer">{FaGithub({ className: "social-icon" }) as any}</a>
            <a href="https://linkedin.com/in/akashramesh13" target="_blank" rel="noopener noreferrer">{FaLinkedin({ className: "social-icon" }) as any}</a>
            <a href="https://leetcode.com/u/akashramesh13/" target="_blank" rel="noopener noreferrer">{SiLeetcode({ className: "social-icon" }) as any}</a>
          </div>
        </div>
      </div>

      <div className="navbar__center">
        {isSearchOpen ? (
          <div className="navbar__inline-search">
            <input 
              autoFocus
              type="text" 
              placeholder="Search stories..." 
              value={inlineSearchQuery}
              onChange={(e) => setInlineSearchQuery(e.target.value)}
              onKeyDown={handleInlineSearch}
            />
          </div>
        ) : (
          <div className="navbar__brand">
            <Link to="/" onClick={closeNavbar}>
              Pixel Pursuit
            </Link>
          </div>
        )}
      </div>

      <div className={`navbar__right ${isOpen ? "active" : ""}`}>
        <div className="navbar__links-container">
          {userInfo ? (
            <>
              <Link className="aeon-link" to="/post/new" onClick={handleAddNewPost}>WRITE</Link>
              <span className="navbar__link-separator">/</span>
              <Link className="aeon-link" to="/profile" onClick={closeNavbar}>PROFILE</Link>
              <span className="navbar__link-separator">/</span>
              <span className="aeon-link" onClick={handleLogout}>SIGN OUT</span>
            </>
          ) : (
            <>
              {location.pathname !== "/register" && (
                <>
                  <Link className="aeon-link" to="/register" onClick={closeNavbar}>REGISTER</Link>
                  <span className="navbar__link-separator">/</span>
                </>
              )}
              <Link className="aeon-link" to="/login" onClick={closeNavbar}>SIGN IN</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile hamburger overlay if needed */}
      <div className="navbar__toggle" onClick={toggleNavbar}>
        <div className={`hamburger ${isOpen ? "active" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* MEGA MENU */}
      <div className={`mega-menu ${isOpen ? "mega-menu--open" : ""}`}>
        <div className="mega-menu__container">
          <div className="mega-menu__grid">
            <div className="mega-menu__col mega-menu__col--primary">
              <Link to="/?category=Philosophy" onClick={closeNavbar} style={{color: '#06696c'}}>Philosophy</Link>
              <Link to="/?category=Science" onClick={closeNavbar} style={{color: '#034d60'}}>Science</Link>
              <Link to="/?category=Psychology" onClick={closeNavbar} style={{color: '#820042'}}>Psychology</Link>
              <Link to="/?category=Society" onClick={closeNavbar} style={{color: '#a12b10'}}>Society</Link>
              <Link to="/?category=Culture" onClick={closeNavbar} style={{color: '#b66904'}}>Culture</Link>
            </div>
            <div className="mega-menu__col mega-menu__col--secondary">
              <Link to="/essays" onClick={closeNavbar}>Essays</Link>
              <Link to="/about" onClick={closeNavbar}>About</Link>
            </div>
          </div>

          <div className="mega-menu__footer">
            <div className="mega-menu__footer-left">
              <a href="https://akashramesh.in" target="_blank" rel="noopener noreferrer">PORTFOLIO</a>
              <a href="https://expensify.akashramesh.in" target="_blank" rel="noopener noreferrer">EXPENSIFY</a>
              <a href="https://indecision.akashramesh.in" target="_blank" rel="noopener noreferrer">INDECISION</a>
            </div>
            <div className="mega-menu__footer-right">
              <div className="mega-menu__search">
                {FiSearch({ className: "search-icon" }) as any}
                <input 
                  type="text" 
                  placeholder="SEARCH" 
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  onKeyDown={handleMenuSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
