import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../helpers/axios";
import "./BlogViewer.scss";
import { GiComputerFan } from "react-icons/gi";

const BlogViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [post, setPost] = useState<{
    title: string;
    content: string;
    owner: boolean;
  }>({
    title: "",
    content: "",
    owner: false,
  });

  const [headings, setHeadings] = useState<{ text: string; id: string }[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, []);

  useEffect(() => {
    if (post.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, "text/html");
      const headingElements = doc.querySelectorAll("h1, h2, h3");

      const newHeadings = Array.from(headingElements).map((el, index) => {
        const id = `heading-${index}`;
        el.setAttribute("id", id); // Ensure the heading has an ID
        return { text: el.textContent || "", id };
      });

      setHeadings(newHeadings);

      // Update actual DOM to include the IDs
      const updatedContent = doc.body.innerHTML;
      setPost((prev) => ({ ...prev, content: updatedContent }));
    }
  }, [post.content]);

  const handleScrollToHeading = (id: string) => {
    const headingElement = document.getElementById(id);
    if (headingElement) {
      headingElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="blog-view">
      <div className="blog-view__content">
        <h1 className="blog-view__title">{post.title}</h1>
        <div
          className="blog-view__body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.owner && (
          <button
            className="blog-view__edit-button"
            onClick={() => history.push(`/post/edit/${id}`)}
          >
            ✏️ Edit
          </button>
        )}
      </div>

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
        <div className="summary">
          <p>
            Summarize
            <span id="summary-icon">
              <GiComputerFan />
            </span>
          </p>
        </div>
      </aside>
    </div>
  );
};

export default BlogViewer;
