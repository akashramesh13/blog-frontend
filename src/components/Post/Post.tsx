import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "../../redux/actions/postsActions";
import { IPost } from "../../types/postsTypes";
import { formatDate } from "../../utils/formatDate";

const getPreview = (content: any, maxLength: number = 140) => {
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

const getReadTime = (content: any) => {
  try {
    const delta = typeof content === "string" ? JSON.parse(content) : content;
    const text = delta.ops
      .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
      .join(" ");
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, minutes);
  } catch {
    return 3;
  }
};

interface PostProps {
  post: IPost;
  handleOnPostClick: (post: IPost) => void;
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick }) => {
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

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      await dispatch(toggleLike(post.id!));
    } catch (err) {
      // Revert on failure
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
    }
  };

  const readTime = getReadTime(post.content);

  return (
    <article className="editorial-row" onClick={() => handleOnPostClick(post)}>
      <div className="editorial-row__header">
        {post.category ? (
          <span className="editorial-row__category">
            {post.category.name}
          </span>
        ) : <span />}
        <span className="editorial-row__date">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <h2 className="editorial-row__title">
        <span className="editorial-row__title-text">{post.title}</span>
        <span className="editorial-row__arrow" aria-hidden="true">&rarr;</span>
      </h2>

      {preview && <p className="editorial-row__excerpt">{preview}</p>}

      <div className="editorial-row__meta">
        <span className="editorial-row__readtime">{readTime} min read</span>
        <span className="editorial-row__dot">&bull;</span>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <button
            type="button"
            className={`editorial-row__like-btn ${isLiked ? "liked" : ""} ${isAnimating ? "pop-animation" : ""}`}
            onClick={handleLike}
            title={isLiked ? "Unlike story" : "Like story"}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isLiked ? "0" : "2"}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likesCount}</span>
          </button>

          {showLoginMsg && (
            <div className="editorial-row__login-tooltip">
              Login required to like
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Post;
