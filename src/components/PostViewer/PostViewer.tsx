import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./PostViewer.scss";
import { RootState } from "../../redux/reducers";
import { deletePost, fetchPost } from "../../redux/actions/postsActions";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
interface TOCItem {
  level: number;
  text: string;
  id: string;
  children: TOCItem[];
}

const PostViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const { post, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  const [headings, setHeadings] = useState<TOCItem[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
  }, [id, dispatch]);

  const [updatedPostContent, setUpdatedPostContent] = useState("");

  useEffect(() => {
    if (!post?.content) return;

    console.log("📜 Post Content Loaded:", post.content);

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<div>${post.content}</div>`,
      "text/html"
    );

    const cleanContent = (element: Element) => {
      element.querySelectorAll("p").forEach((p) => {
        if (!p.textContent?.trim()) {
          p.remove();
        }
      });

      element.querySelectorAll("*").forEach((el) => {
        if (el.tagName === "P" || el.tagName === "DIV") {
          const style = window.getComputedStyle(el);
          const marginTop = parseFloat(style.marginTop);
          const marginBottom = parseFloat(style.marginBottom);

          if (marginTop > 1.5) {
            (el as HTMLElement).style.marginTop = "1.5em";
          }
          if (marginBottom > 1.5) {
            (el as HTMLElement).style.marginBottom = "1.5em";
          }
        }
      });
    };

    cleanContent(doc.body);

    const headingElements = doc.querySelectorAll("h1, h2, h3");

    console.log("📌 Extracted Headings:", headingElements);

    const toc: TOCItem[] = [];
    let lastH1: TOCItem | null = null;
    let lastH2: TOCItem | null = null;

    headingElements.forEach((el, index) => {
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || "";
      const id = `heading-${index}`;

      el.id = id;

      if (tagName === "h1") {
        lastH1 = { level: 1, text, id, children: [] };
        toc.push(lastH1);
        lastH2 = null;
      } else if (tagName === "h2") {
        const newH2 = { level: 2, text, id, children: [] };
        if (lastH1) {
          lastH1.children.push(newH2);
        } else {
          toc.push(newH2);
        }
        lastH2 = newH2;
      } else if (tagName === "h3") {
        const newH3 = { level: 3, text, id, children: [] };
        if (lastH2) {
          lastH2.children.push(newH3);
        } else if (lastH1) {
          lastH1.children.push(newH3);
        } else {
          toc.push(newH3);
        }
      }
    });

    console.log("📑 Final TOC:", toc);
    setHeadings(toc);

    setUpdatedPostContent(doc.body.innerHTML);
  }, [post?.content]);

  const handleDeleteButtonClick = async () => {
    await dispatch(deletePost(id));
    history.push("/");
  };

  const handleScrollToHeading = (id: string) => {
    setTimeout(() => {
      const headingElement = document.getElementById(id);
      if (headingElement) {
        const yOffset = -75;
        const yPosition =
          headingElement.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
          top: yPosition,
          behavior: "smooth",
        });
      }
    }, 200);
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
              <p className="post-view__title">{post.title}</p>
              {post.coverImage && (
                <img
                  src={`data:image/png;base64,${post.coverImage}`}
                  alt="Cover"
                  className="post-cover-image"
                />
              )}

              {headings.length > 0 && (
                <aside className="toc-sidebar">
                  <h3>Table of Contents</h3>
                  <ul>
                    {headings.map((h1, i) => (
                      <li key={h1.id}>
                        <button onClick={() => handleScrollToHeading(h1.id)}>
                          {i + 1}. {h1.text}
                        </button>
                        {h1.children.length > 0 && (
                          <ul>
                            {h1.children.map((h2, j) => (
                              <li key={h2.id} style={{ marginLeft: "15px" }}>
                                <button
                                  onClick={() => handleScrollToHeading(h2.id)}
                                >
                                  {i + 1}.{j + 1} {h2.text}
                                </button>
                                {h2.children.length > 0 && (
                                  <ul>
                                    {h2.children.map((h3, k) => (
                                      <li
                                        key={h3.id}
                                        style={{ marginLeft: "30px" }}
                                      >
                                        <button
                                          onClick={() =>
                                            handleScrollToHeading(h3.id)
                                          }
                                        >
                                          {i + 1}.{j + 1}.{k + 1} {h3.text}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              <div className="post-meta">
                <div className="meta-left">
                  <p>
                    Created by{" "}
                    <a href="#" className="user-link">
                      {post.user?.username || "Unknown User"}
                    </a>
                  </p>
                  <p>
                    on{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                {post.createdAt !== post.updatedAt && post.updatedAt && (
                  <div className="meta-right">
                    <p>
                      Updated on {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div
                className="post-view__body"
                dangerouslySetInnerHTML={{ __html: updatedPostContent || "" }}
              />
              {post.owner && (
                <div className="post-actions">
                  <button
                    className="post-view__edit-button"
                    onClick={() => history.push(`/post/edit/${id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="post-view__delete-button"
                    onClick={handleDeleteButtonClick}
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
    </div>
  );
};

export default PostViewer;
