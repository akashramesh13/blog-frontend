import React, { useEffect, useState } from "react";
import "./Home.scss";
import { useHistory } from "react-router-dom";
import axios from "../../helpers/axios";
import Post from "../Post/Post";

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
  isOwner: boolean;
}

interface ICategory {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const trendingPosts = [
    "AI Breakthrough",
    "Stock Market Crash",
    "Best Travel Tips",
    "Healthy Diet Hacks",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get<IPost[]>("/posts/");
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get<ICategory[]>("/category/");
        setCategories(data);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      }
    };

    fetchPosts();
    fetchCategories();
  }, []);

  const handleOnPostClick = (post: IPost) => {
    history.push(`/post/view/${post.id}`, post);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>

      <div className="home">
        <div className="home__header">
          <h1 className="home__title">Welcome to Pixel Pursuit</h1>
        </div>

        <div className="home__posts">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              handleOnPostClick={handleOnPostClick}
            />
          ))}
        </div>
      </div>

      <div className="sidebar">
        <h2>Trending Posts</h2>
        <ul>
          {trendingPosts.map((post, index) => (
            <li key={index}>{post}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
