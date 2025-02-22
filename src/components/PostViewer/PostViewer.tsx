import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./PostViewer.scss";
import { RootState } from "../../redux/reducers";
import { deletePost, fetchPost } from "../../redux/reducers/postsReducer";
import Loading from "../Loading/Loading";

const PostViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch: any = useDispatch();

  const { post, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [headings, setHeadings] = useState<{ text: string; id: string }[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, "text/html");
      const headingElements = doc.querySelectorAll("h1, h2, h3");

      const newHeadings = Array.from(headingElements).map((el, index) => {
        const id = `heading-${index}`;
        el.setAttribute("id", id);
        return { text: el.textContent || "", id };
      });

      setHeadings(newHeadings);
    }
  }, [post?.content]);

  const handleDeleteButtonClick = async (id: Number) => {
    await dispatch(deletePost(Number(id)));
    history.push("/");
  };

  const handleScrollToHeading = (id: string) => {
    const headingElement = document.getElementById(id);
    if (headingElement) {
      headingElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="post-view">
      {loading ? (
        <Loading />
      ) : (
        <div className="post-view__content">
          {post ? (
            <>
              <h1 className="post-view__title">{post.title}</h1>
              <div
                className="post-view__body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              {post.owner && (
                <div>
                  <button
                    className="post-view__edit-button"
                    onClick={() => history.push(`/post/edit/${id}`)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="post-view__delete-button"
                    onClick={async () => handleDeleteButtonClick(Number(id))}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>Post not found</div>
          )}
        </div>
      )}
      {headings && headings.length > 0 && (
        <aside className="toc-sidebar">
          <h3>Table of Contents</h3>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id}>
                <button onClick={() => handleScrollToHeading(heading.id)}>
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
};

export default PostViewer;
