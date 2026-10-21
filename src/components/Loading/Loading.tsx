import React from 'react';
import './Loading.scss';

interface LoadingProps {
  inline?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ inline }) => {
  if (inline) {
    return <div className="loading-spinner-inline"></div>;
  }
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
