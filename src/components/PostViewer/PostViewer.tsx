import React, { useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./PostViewer.scss";
import { RootState } from "../../redux/reducers";
import { deletePost, fetchPost, toggleLike } from "../../redux/actions/postsActions";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import DeleteModal from "../DeleteModal/DeleteModal";
import TableOfContents from "../TableOfContents/TableOfContents";
import ReactQuill from "react-quill";
import { formatDate } from "../../utils/formatDate";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const getReadStats = (content: any) => {
  try {
    const delta = typeof content === "string" ? JSON.parse(content) : content;
    const text = delta.ops
      .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
      .join(" ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return { words, readTime: Math.max(1, minutes) };
  } catch {
    return { words: 0, readTime: 1 };
  }
};

const PostViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { post, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // FETCH
  useEffect(() => {
    if (id && post?.id !== id) {
      dispatch(fetchPost(id));
    }
  }, [id, dispatch, post?.id]);

  // PARSE CONTENT (supports string + object)
  const parsedContent = useMemo(() => {
    if (!post?.content) return { ops: [] };

    try {
      return typeof post.content === "string"
        ? JSON.parse(post.content)
        : post.content;
    } catch {
      return { ops: [] };
    }
  }, [post?.content]);

  // ADD IDs FOR TOC SCROLL
  useEffect(() => {
    const headings = document.querySelectorAll(
      ".post-view__body h1, .post-view__body h2, .post-view__body h3",
    );

    headings.forEach((el, index) => {
      el.setAttribute("id", `heading-${index}`);
    });
  }, [parsedContent]);

  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const handleDeleteConfirm = async () => {
    await dispatch(deletePost(id));
    history.push("/");
  };

  // Sync state when post changes
  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked || false);
      setLikesCount(post.likesCount || 0);
    }
  }, [post]);

  const handleLike = async () => {
    if (!userInfo) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }

    if (isAnimating) return;

    if (id) {
      // Optimistic UI update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      // Animation trigger
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      try {
        await dispatch(toggleLike(id));
      } catch (err) {
        // Revert on failure
        setIsLiked(!newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
      }
    }
  };

  if (error) return <div>Error: {error}</div>;

  const { words, readTime } = getReadStats(post?.content);
  const isOwner = post?.owner || (post?.user && userInfo && post.user.id === userInfo.id);

  return (
    <div className="post-view">
      {loading && post?.id !== id ? (
        <Loading />
      ) : post ? (
        <>
          {/* HEADER */}
          <div className="post-header">
            <div className="post-header__left">
              {post.category && (
                <div style={{ marginBottom: "0.8rem" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      color: "var(--color-accent)",
                    }}
                  >
                    {post.category.name}
                  </span>
                </div>
              )}

              <h1 className="post-view__title">{post.title}</h1>

              {post.subtitle && (
                <p
                  style={{
                    fontFamily: '"Libre Baskerville", serif',
                    fontSize: "1.2rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.5,
                    margin: "0.5rem 0 1.2rem",
                  }}
                >
                  {post.subtitle}
                </p>
              )}

              <div className="post-meta">
                <span className="author">
                  {post.user?.username || "Unknown"}
                </span>
                <span className="dot">&bull;</span>
                <span>{formatDate(post.createdAt)}</span>
                <span className="dot">&bull;</span>
                <span>{readTime} min read ({words.toLocaleString()} words)</span>
                <span className="dot">&bull;</span>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    className={`like-button ${isAnimating ? "pop-animation" : ""}`}
                    onClick={handleLike}
                    title={isLiked ? "Unlike post" : "Like post"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: isLiked ? "#ff4d6d" : "var(--color-text-muted)",
                      padding: 0,
                      fontFamily: "inherit",
                      fontSize: "0.95rem",
                      transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
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
                    <span style={{ fontWeight: isLiked ? "600" : "400" }}>{likesCount}</span>
                  </button>

                  {showLoginMsg && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
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

              {isOwner && (
                <div className="post-actions">
                  <button
                    className="post-view__edit-button"
                    onClick={() => history.push(`/post/edit/${id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="post-view__delete-button"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {post.coverImage && (
            <div className="post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          {/* TOC */}
          <TableOfContents content={parsedContent} />

          {/* CONTENT */}
          <div className="post-view__body">
            <ReactQuill value={parsedContent} readOnly theme="bubble" />
          </div>

          {/* MODAL */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title={post.title}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>Post not found</div>
      )}
    </div>
  );
};

export default PostViewer;
