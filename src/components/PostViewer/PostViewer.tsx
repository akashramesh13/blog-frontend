import React, { useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./PostViewer.scss";
import { RootState } from "../../redux/reducers";
import { deletePost, fetchPost } from "../../redux/actions/postsActions";
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

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-view">
      {loading ? (
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
