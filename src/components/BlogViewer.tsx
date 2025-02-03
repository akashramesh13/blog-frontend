import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "../helpers/axios";
import "./BlogViewer.scss";

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
  }, [id]);

  return (
    <div className="blog-view">
      <h1 className="blog-view__title">{post.title}</h1>
      <div
        className="blog-view__content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.owner && (
        <button
          className="blog-view__edit-button"
          onClick={() => history.push(`/blog/edit/${id}`)}
        >
          ✏️ Edit
        </button>
      )}
    </div>
  );
};

export default BlogViewer;
