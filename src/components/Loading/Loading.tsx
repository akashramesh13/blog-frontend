import React from "react";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <span className="loader-label">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
