import React from 'react';
import './Loading.scss';

interface LoadingProps {
  inline?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ inline }) => {
  if (inline) {
    return <div className="aeon-loading-spinner inline"></div>;
  }
  return (
    <div className="aeon-loading-container">
      <div className="aeon-loading-spinner"></div>
    </div>
  );
};

export default Loading;
