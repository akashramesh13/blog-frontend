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
      history.push("/login");
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
    <div className="post-view">
      {loading && post?.id !== id ? (
        <Loading />
      ) : post ? (
        <>
          {post.coverImage && (
            <div className="post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}
          {/* HEADER */}
          <div className="post-header">
            <div className="post-header__left">
              <h1 className="post-view__title">{post.title}</h1>

              <div className="post-meta">
                <span className="author">
                  {post.user?.username || "Unknown"}
                </span>
                <span className="dot">·</span>
                <button 
                  className={`like-button ${isAnimating ? 'pop-animation' : ''}`}
                  onClick={handleLike}
                  title={isLiked ? "Unlike post" : "Like post"}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: isLiked ? '#ff4d6d' : '#888', padding: 0,
                    fontFamily: 'inherit', fontSize: '1rem',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <svg 
                    width="20" height="20" viewBox="0 0 24 24" 
                    fill={isLiked ? "currentColor" : "none"} 
                    stroke="currentColor" strokeWidth={isLiked ? "0" : "2"}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                  </svg>
                  <span style={{ fontWeight: isLiked ? '600' : '400' }}>{likesCount}</span>
                </button>
              </div>

              {post.owner && (
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
        <div>Post not found</div>
      )}
    </div>
  );
};

export default PostViewer;
