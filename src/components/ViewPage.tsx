import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./ViewPage.scss";
import axios from "../helpers/axios";

// Dummy data for demonstration

const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState({
    title: "",
    content: "",
    owner: false,
  });
  const [content, setContent] = useState(post?.content ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const history = useHistory();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/posts/${id}`);
        console.log(data);
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="view">
      <h1 className="view__title">View Post</h1>
      <div className="view__form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={post.title}
          disabled={!post.owner}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="view__form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={post.content}
          disabled={!post.owner}
          onChange={(e) => setContent(e.target.value)}
        />
        {post.owner ? <button>Edit</button> : null}
      </div>
    </div>
  );
};

export default ViewPage;
