import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // SCROLL PROGRESS LISTENER
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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

  if (error) {
    return (
      <div className="post-view">
        <div className="post-view__not-found">
          <h2>Unable to load story</h2>
          <p>{error}</p>
          <Link to="/" className="post-view__back-link">&larr; Back to all stories</Link>
        </div>
      </div>
    );
  }

  const { words, readTime } = getReadStats(post?.content);
  const isOwner = post?.owner || (post?.user && userInfo && post.user.id === userInfo.id);

  return (
    <div className="post-view">
      {/* Scroll Progress Bar at the very top */}
      <div
        className="post-view__progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {loading && post?.id !== id ? (
        <div className="post-view__loader">
          <Loading />
        </div>
      ) : post ? (
        <>
          {/* EDITORIAL HEADER (Centered, max-width ~820px) */}
          <header className="post-view__header">
            {post.category && (
              <div className="post-view__category-wrapper">
                <span className="post-view__category">
                  {post.category.name}
                </span>
              </div>
            )}

            <h1 className="post-view__title">{post.title}</h1>

            {post.subtitle && (
              <p className="post-view__subtitle">{post.subtitle}</p>
            )}

            <div className="post-view__meta-bar">
              <div className="post-view__meta-info">
                <span className="post-view__author">
                  {post.user?.username || "Unknown"}
                </span>
                <span className="post-view__dot">&bull;</span>
                <span className="post-view__date">{formatDate(post.createdAt)}</span>
                <span className="post-view__dot">&bull;</span>
                <span className="post-view__readtime">{readTime} min read</span>
                <span className="post-view__dot">&bull;</span>
                <span className="post-view__wordcount">{words.toLocaleString()} words</span>
                <span className="post-view__dot">&bull;</span>

                <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                  <button
                    type="button"
                    className={`post-view__like-btn ${isLiked ? "liked" : ""} ${isAnimating ? "pop-animation" : ""}`}
                    onClick={handleLike}
                    title={isLiked ? "Unlike story" : "Like story"}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    <div className="post-view__login-tooltip">
                      Login required to like
                    </div>
                  )}
                </div>
              </div>

              {/* Author Options ••• Menu (Apple Style, replaces generic edit/delete pills) */}
              {isOwner && (
                <div className="post-view__actions-menu" ref={menuRef}>
                  <button
                    type="button"
                    className="post-view__menu-trigger"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Story options"
                    title="Story options"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="post-view__dropdown" role="menu">
                      <button
                        type="button"
                        className="post-view__dropdown-item"
                        onClick={() => {
                          setIsMenuOpen(false);
                          history.push(`/post/edit/${id}`);
                        }}
                        role="menuitem"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit Story</span>
                      </button>
                      <button
                        type="button"
                        className="post-view__dropdown-item destructive"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        role="menuitem"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete Story</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* HERO COVER IMAGE (Wider than body text: max-width 1040px) */}
          {post.coverImage && (
            <div className="post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          {/* TABLE OF CONTENTS (max-width 720px) */}
          <div className="post-view__toc-wrapper">
            <TableOfContents content={parsedContent} />
          </div>

          {/* BODY CONTENT (max-width 720px, 18-19px, line-height 1.8) */}
          <main className="post-view__body">
            <ReactQuill value={parsedContent} readOnly theme="bubble" />
          </main>

          {/* EDITORIAL FOOTER */}
          <footer className="post-view__footer">
            <div className="post-view__footer-divider" />
            <p className="post-view__thank-you">Thank you for reading.</p>
            <Link to="/" className="post-view__back-link">
              &larr; Back to all stories
            </Link>
          </footer>

          {/* MODAL */}
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title={post.title}
          />
        </>
      ) : (
        <div className="post-view__not-found">
          <h2>Story not found</h2>
          <Link to="/" className="post-view__back-link">&larr; Back to all stories</Link>
        </div>
      )}
    </div>
  );
};

export default PostViewer;
