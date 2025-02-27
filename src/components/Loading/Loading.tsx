import React from "react";
import "./Loading.scss";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="cat">
        <div className="ear ear--left"></div>
        <div className="ear ear--right"></div>
        <div className="face">
          <div className="eye eye--left">
            <div className="eye-pupil"></div>
          </div>
          <div className="eye eye--right">
            <div className="eye-pupil"></div>
          </div>
          <div className="muzzle"></div>
        </div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
