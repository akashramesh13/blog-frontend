import React, { useEffect, useState } from "react";
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

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const PostViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { post, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );

  // ✅ FETCH POST
  useEffect(() => {
    if (id) dispatch(fetchPost(id));
  }, [id, dispatch]);

  // ✅ PARSE CONTENT
  let parsedContent: any = { ops: [] };

  if (post?.content) {
    try {
      parsedContent =
        typeof post.content === "string"
          ? JSON.parse(post.content)
          : post.content;
    } catch {
      parsedContent = { ops: [] };
    }
  }

  // ✅ ADD IDS (HOOK MUST BE BEFORE RETURN)
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

  // ✅ RETURNS AFTER HOOKS
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-view">
      {loading ? (
        <Loading />
      ) : post ? (
        <>
          <h1 className="post-view__title">{post.title}</h1>

          <div className="post-meta">
            <span className="author">{post.user?.username || "Unknown"}</span>
            <span className="dot">·</span>

            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <TableOfContents content={parsedContent} />

          <div className="post-view__body">
            <ReactQuill value={parsedContent} readOnly theme="bubble" />
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
