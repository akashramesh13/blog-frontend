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

const PostViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { post, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );

  // FETCH
  useEffect(() => {
    if (id) dispatch(fetchPost(id));
  }, [id, dispatch]);

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

  const handleDeleteConfirm = async () => {
    await dispatch(deletePost(id));
    history.push("/");
  };

  const handleLike = async () => {
    if (id) {
      await dispatch(toggleLike(id));
      dispatch(fetchPost(id)); // Re-fetch to get updated like count and status
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
                <span>{formatDate(post.createdAt)}</span>
                <span className="dot">·</span>
                <button 
                  className={`like-button ${post.isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  title={post.isLiked ? "Unlike post" : "Like post"}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    color: post.isLiked ? '#e0245e' : 'inherit', padding: 0,
                    fontFamily: 'inherit', fontSize: '1rem'
                  }}
                >
                  <svg 
                    width="18" height="18" viewBox="0 0 24 24" 
                    fill={post.isLiked ? "currentColor" : "none"} 
                    stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{post.likesCount || 0}</span>
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
