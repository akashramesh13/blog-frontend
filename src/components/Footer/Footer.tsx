import React from "react";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>
        Made with <span className="heart" style={{ display: 'inline-block', verticalAlign: '-2px', margin: '0 4px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#ff4d6d" stroke="none" style={{ display: 'block' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </span> in Chennai
      </p>
    </footer>
  );
};

export default Footer;
