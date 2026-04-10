import React from "react";
import moment from "moment";
import { IPost } from "../../types/postsTypes";

const getPreview = (content: any, maxLength: number = 120) => {
  try {
    const delta = typeof content === "string" ? JSON.parse(content) : content;

    const text = delta.ops
      .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
      .join("")
      .replace(/\n/g, " ")
      .trim();

    if (!text) return "";

    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength).trim() + "...";
  } catch {
    return "";
  }
};

interface PostProps {
  post: IPost;
  handleOnPostClick: (post: IPost) => void;
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick }) => {
  const preview = getPreview(post.content);

  return (
    <div className="home__post" onClick={() => handleOnPostClick(post)}>
      <h2 className="home__post-title">{post.title}</h2>

      {preview && <p className="home__post-excerpt">{preview}</p>}

      <span className="home__post-date">
        {moment(post.createdAt).format("DD MMM, YY")}
      </span>
    </div>
  );
};

export default Post;
