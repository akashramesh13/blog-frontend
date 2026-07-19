import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'title' | 'avatar' | 'post-card' | 'profile';
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, className = "", style = {}, type }) => {
  if (type === 'post-card') {
    return (
      <div className={`skeleton-wrapper skeleton-post-card ${className}`} style={style}>
        <div className="skeleton-base" style={{ width: '70%', height: '24px', marginBottom: '12px' }} />
        <div className="skeleton-base" style={{ width: '100%', height: '16px', marginBottom: '8px' }} />
        <div className="skeleton-base" style={{ width: '90%', height: '16px', marginBottom: '16px' }} />
        <div className="skeleton-base" style={{ width: '30%', height: '12px' }} />
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className={`skeleton-wrapper skeleton-profile ${className}`} style={style}>
        <div className="skeleton-profile__header">
           <div className="skeleton-base" style={{ width: 120, height: 120, borderRadius: '50%' }} />
           <div className="skeleton-profile__info">
             <div className="skeleton-base" style={{ width: 250, height: 32, marginBottom: 12 }} />
             <div className="skeleton-base" style={{ width: 120, height: 16 }} />
           </div>
        </div>
        <div className="skeleton-profile__bio">
           <div className="skeleton-base" style={{ width: '100%', height: 18, marginBottom: 8 }} />
           <div className="skeleton-base" style={{ width: '95%', height: 18, marginBottom: 8 }} />
           <div className="skeleton-base" style={{ width: '80%', height: 18 }} />
        </div>
      </div>
    );
  }

  const mergedStyle = {
    width,
    height,
    borderRadius: type === 'avatar' ? '50%' : borderRadius,
    ...style
  };

  return <div className={`skeleton-base ${className}`} style={mergedStyle} />;
};

export default Skeleton;
