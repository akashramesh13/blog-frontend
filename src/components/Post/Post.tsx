import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../../redux/actions/postsActions";
import { IPost } from "../../types/postsTypes";
import { formatDate } from "../../utils/formatDate";

const getPreview = (content: any, maxLength: number = 120) => {
  try {
    const delta = typeof content === "string" ? JSON.parse(content) : content;

    const text = delta.ops
      .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
      .join("")
      .replace(/\n/g, " ")
      .trim();

    if (!text) return "";

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength).trim() + "...";
  } catch {
    return "";
  }
};

interface PostProps {
  post: IPost;
  handleOnPostClick: (post: IPost) => void;
  isHero?: boolean;
  isGridCard?: boolean;
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick, isHero, isGridCard }) => {
  const preview = post.subtitle || getPreview(post.content);
  const dispatch = useDispatch<any>();
  const { userInfo } = useSelector((state: any) => state.auth);

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userInfo) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }
    
    if (isAnimating) return;
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      await dispatch(toggleLike(post.id!));
    } catch (err) {
      setIsLiked(!newIsLiked);
      setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1);
    }
  };

  const LikeButton = () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        className={`post-likes ${isAnimating ? 'pop-animation' : ''}`} 
        style={{ 
          display: 'flex', alignItems: 'center', gap: '6px', 
          color: isLiked ? '#ff4d6d' : (isHero ? 'rgba(255,255,255,0.8)' : '#888'),
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={handleLike} 
      >
        <svg 
          width="18" height="18" viewBox="0 0 24 24" 
          fill={isLiked ? "currentColor" : "none"} 
          stroke="currentColor" strokeWidth={isLiked ? "0" : "2"}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
        <span style={{ fontSize: '0.95rem', fontWeight: isLiked ? '600' : '400' }}>{likesCount}</span>
      </div>
      {showLoginMsg && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: '50%',
          transform: 'translateX(50%)',
          marginBottom: '8px',
          background: '#222',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-aeon-sans)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 10
        }}>
          Login required to like
        </div>
      )}
    </div>
  );

  const imageUrl = post.thumbnail || post.coverImage;

  if (isHero) {
    return (
      <div className="home__post--hero" onClick={() => handleOnPostClick(post)} style={{ 
        backgroundColor: '#ca2127', 
        backgroundImage: post.coverImage ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${post.coverImage})` : 'none', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">{post.title}</h1>
          {preview && <p className="hero-excerpt">{preview}</p>}
          <div className="hero-footer">
            <span className="hero-date">{formatDate(post.createdAt)}</span>
            <LikeButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`home__post ${isGridCard ? 'home__post--grid' : ''}`} onClick={() => handleOnPostClick(post)}>
      {isGridCard && post.coverImage && (
        <div className="grid-image" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}></div>
      )}
      <h2 className="home__post-title">{post.title}</h2>
      {preview && <p className="home__post-excerpt">{preview}</p>}

      <div className="home__post-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span className="home__post-date">{formatDate(post.createdAt)}</span>
        <LikeButton />
      </div>
    </div>
  );
};

export default Post;
