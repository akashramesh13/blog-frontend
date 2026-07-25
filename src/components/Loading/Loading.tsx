import React from 'react';
import './Loading.scss';

const Loading: React.FC = () => {
  return (
    <div className="aeon-loading-container">
      <div className="aeon-loading-spinner"></div>
    </div>
  );
};

export default Loading;
