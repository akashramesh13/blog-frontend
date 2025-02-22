import React from "react";
import moment from "moment";

const stripHtmlAndTruncate = (html: string, maxLength: number = 100) => {
  const plainText = html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
};

interface IPost {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  owner: boolean;
}

interface PostProps {
  post: IPost;
  handleOnPostClick: (post: IPost) => void;
}

const Post: React.FC<PostProps> = ({ post, handleOnPostClick }) => {
  return (
    <div className="home__post" onClick={() => handleOnPostClick(post)}>
      <h2 className="home__post-title">{post.title}</h2>
      <p className="home__post-excerpt">
        {stripHtmlAndTruncate(post.content, 20)}
      </p>
      <span className="home__post-date">
        {moment(post.createdAt).format("DD MMM, YY")}
      </span>
    </div>
  );
};

export default Post;
