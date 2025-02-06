import React, { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./Layout.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
