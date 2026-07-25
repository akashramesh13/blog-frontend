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
import ReactQuill from "react-quill";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

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
    if (!post?.content) return "";

    if (typeof post.content === "string") {
      try {
        // Test if it's a JSON Delta object
        const parsed = JSON.parse(post.content);
        if (parsed && parsed.ops) return parsed;
        return post.content;
      } catch {
        // If not JSON, return as raw HTML string
        return post.content;
      }
    }
    return post.content;
  }, [post?.content]);

  // ADD IDs FOR TOC SCROLL (Legacy, but keeping for any old links)
  useEffect(() => {
    const headings = document.querySelectorAll(
      ".post-view__body h1, .post-view__body h2, .post-view__body h3",
    );

    headings.forEach((el, index) => {
      el.setAttribute("id", `heading-${index}`);
    });
  }, [parsedContent]);

  const { words, readTime } = useMemo(() => {
    let text = "";
    if (parsedContent && parsedContent.ops) {
      text = parsedContent.ops
        .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
        .join(" ");
    } else if (typeof parsedContent === "string") {
      text = parsedContent.replace(/<[^>]+>/g, " ");
    }
    const w = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const rt = Math.max(1, Math.ceil(w / 200));
    return { words: w, readTime: rt };
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

    if (isAnimating) return; // Prevent rapid clicking while animating

    if (id) {
      // Optimistic UI update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      // Animation trigger
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      try {
        await dispatch(toggleLike(id));
      } catch (err) {
        // Revert on failure
        setIsLiked(!newIsLiked);
        setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1);
      }
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-view-container">
      {loading && post?.id !== id ? (
        <Loading />
      ) : post ? (
        <>
          <div 
            className={`post-hero ${!post.coverImage ? 'post-hero--no-image' : ''}`} 
            style={post.coverImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${post.coverImage})` } : {}}
          >
            <div className="post-hero__content">
              <h1 className="post-hero__title">{post.title}</h1>
              {post.subtitle && <p className="post-hero__subtitle">{post.subtitle}</p>}
            </div>
          </div>

          <div className="post-view">
            {/* SIDEBAR */}
            <div className="post-view__sidebar">
              <div className="sidebar-meta">
                <p className="author-name">Written by <strong>{post.user?.username || "Unknown"}</strong></p>
                <p className="post-date">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                
                <div style={{ margin: '1.5rem 0', height: '1px', background: '#eaeaea' }}></div>

                <p className="read-stats">{words.toLocaleString()} words</p>
                <p className="read-time">{readTime} minute read</p>

                <div style={{ margin: '1.5rem 0', height: '1px', background: '#eaeaea' }}></div>

                <div className="post-actions-sidebar">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button 
                      className={`like-button ${isAnimating ? 'pop-animation' : ''}`}
                      onClick={handleLike}
                      title={isLiked ? "Unlike post" : "Like post"}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: isLiked ? '#8a0322' : '#888', padding: 0,
                        fontFamily: 'inherit', fontSize: '1rem',
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      <svg 
                        width="22" height="22" viewBox="0 0 24 24" 
                        fill={isLiked ? "currentColor" : "none"} 
                        stroke="currentColor" strokeWidth={isLiked ? "0" : "2"}
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span style={{ fontWeight: isLiked ? '600' : '400', fontSize: '1.1rem' }}>{likesCount}</span>
                    </button>
                    {showLoginMsg && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        marginTop: '8px',
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

                  { (post.owner || (post.user && userInfo && post.user.id === userInfo.id)) && (
                    <div className="owner-actions" style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <button onClick={() => history.push(`/post/edit/${id}`)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                      <button onClick={() => setIsDeleteModalOpen(true)} className="btn-action" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* CONTENT */}
            <div className="post-view__body">
              <ReactQuill value={parsedContent} readOnly theme="bubble" />
            </div>
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
        <div>Post not found</div>
      )}
    </div>
  );
};

export default PostViewer;
