import React from "react";
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
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick }) => {
  const preview = getPreview(post.content);

  return (
    <div className="home__post" onClick={() => handleOnPostClick(post)}>
      <h2 className="home__post-title">{post.title}</h2>

      {preview && <p className="home__post-excerpt">{preview}</p>}

      <div className="home__post-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="home__post-date">{formatDate(post.createdAt)}</span>
        
        <div 
          className="post-likes" 
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: post.isLiked ? '#e0245e' : 'inherit' }}
          onClick={(e) => e.stopPropagation()} 
        >
          <svg 
            width="16" height="16" viewBox="0 0 24 24" 
            fill={post.isLiked ? "currentColor" : "none"} 
            stroke="currentColor" strokeWidth="2" 
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span style={{ fontSize: '0.9rem' }}>{post.likesCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
