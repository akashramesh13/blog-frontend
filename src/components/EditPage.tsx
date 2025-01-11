import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./EditPage.scss";
import axios from "../helpers/axios";

// Dummy data for demonstration

const EditPage: React.FC = () => {
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

  const handleSave = () => {
    // Simulate saving the post
    console.log("Saving post:", { id, title, content });
    // Navigate back to home or another route after saving
    history.push("/");
  };

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="edit">
      <h1 className="edit__title">Edit Post</h1>
      <form className="edit__form">
        <div className="edit__form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={post.title}
            disabled={!post.owner}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="edit__form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={post.content}
            disabled={!post.owner}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="button" disabled={!post.owner} onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditPage;
