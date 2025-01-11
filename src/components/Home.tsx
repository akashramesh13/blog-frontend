import React from "react";
import "./Home.scss";
import { useHistory } from "react-router-dom";

const dummyPosts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    excerpt:
      "Learn about the most important hooks in React and how they can simplify your code...",
    date: "January 9, 2025",
  },
  {
    id: 2,
    title: "A Guide to JavaScript Closures",
    excerpt:
      "Closures are a fundamental concept in JavaScript. This guide will help you understand them with ease...",
    date: "January 8, 2025",
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    excerpt:
      "Wondering whether to use CSS Grid or Flexbox? This article will break down their differences and use cases...",
    date: "January 7, 2025",
  },
];

const Home: React.FC = () => {
  const history = useHistory();

  const handleOnPostClick = (post: any) => {
    const redirectUrl = `/edit/${post.id}`;
    history.push({
      pathname: redirectUrl,
      state: post,
    });
  };

  return (
    <div className="home">
      <h1 className="home__title">Welcome to My Blog</h1>
      <div className="home__posts">
        {dummyPosts.map((post) => (
          <div
            key={post.id}
            className="home__post"
            onClick={() => handleOnPostClick(post)}
          >
            <h2 className="home__post-title">{post.title}</h2>
            <p className="home__post-excerpt">{post.excerpt}</p>
            <span className="home__post-date">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
