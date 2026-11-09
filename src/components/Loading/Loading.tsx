import React from 'react';
import './Loading.scss';

interface LoadingProps {
  inline?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ inline, size = 'small' }) => {
  if (inline) {
    return <div className={`loading-spinner-inline loading-spinner-inline--${size}`} />;
  }
  return (
    <div className="loading-container">
      <div className="loader-dots">
        <span />
        <span />
        <span />
      </div>
      <p className="loading-text">Loading</p>
    </div>
  );
};

export default Loading;
