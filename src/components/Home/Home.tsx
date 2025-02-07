import React, { useEffect, useState } from "react";
import "./Home.scss";
import { useHistory } from "react-router-dom";
import moment from "moment";
import axios from "../../helpers/axios";

interface IPost {
  id: number;
  title: string;
  content: string;
  user: {
    id: Number;
    username: String;
  };
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
}

const Home: React.FC = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`/posts/`);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleOnPostClick = (post: any) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const stripHtmlAndTruncate = (html: string, maxLength: number = 100) => {
    const plainText = html.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength)}...`
      : plainText;
  };

  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">Welcome to Pixel Pursuit</h1>
      </div>

      <div className="home__posts">
        {posts.map((post) => (
          <div
            key={post.id}
            className="home__post"
            onClick={() => handleOnPostClick(post)}
          >
            <h2 className="home__post-title">{post.title}</h2>
            <p className="home__post-excerpt">
              {stripHtmlAndTruncate(post.content, 10)}{" "}
              {/* Adjust the length here */}
            </p>
            <span className="home__post-date">
              {moment(post.createdAt).format("DD MMM, YY")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
