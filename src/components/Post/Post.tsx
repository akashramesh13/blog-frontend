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
    <div className="home__post" onClick={() => handleOnPostClick(post)}>
      {post.category && (
        <div style={{ marginBottom: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--color-accent)",
            }}
          >
            {post.category.name}
          </span>
        </div>
      )}

      <h2 className="home__post-title">{post.title}</h2>

      {preview && <p className="home__post-excerpt">{preview}</p>}

      <div
        className="home__post-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <span className="home__post-date">
          {readTime} min read &bull; {formatDate(post.createdAt)}
        </span>

        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            className={`post-likes ${isAnimating ? "pop-animation" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: isLiked ? "#ff4d6d" : "var(--color-text-muted)",
              cursor: "pointer",
              transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onClick={handleLike}
            title={isLiked ? "Unlike post" : "Like post"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isLiked ? "0" : "2"}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
            </svg>
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: isLiked ? 600 : 400,
              }}
            >
              {likesCount}
            </span>
          </div>

          {showLoginMsg && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                right: "50%",
                transform: "translateX(50%)",
                marginBottom: "8px",
                background: "var(--color-surface2)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              Login required to like
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
