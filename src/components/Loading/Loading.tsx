import React from 'react';
import './Loading.scss';

interface LoadingProps {
  inline?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ inline }) => {
  if (inline) {
    return <div className="loading-spinner-inline" />;
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
