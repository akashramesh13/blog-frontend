import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPosts,
  fetchCategories,
  clearPosts,
} from "../../redux/actions/postsActions";
import Post from "../Post/Post";
import "./Home.scss";
import Loading from "../Loading/Loading";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { IPost } from "../../types/postsTypes";
import Typed from "typed.js";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { posts, categories, loading, totalPages } = useSelector(
    (state: RootState) => state.posts
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [showTyped, setShowTyped] = useState(false);

  const size = 5;
  const observer = useRef<IntersectionObserver | null>(null);

  const typedElement = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      setShowTyped(true);
    }
  }, [loading, posts]);

  useEffect(() => {
    if (showTyped && typedElement.current) {
      const typed = new Typed(typedElement.current, {
        strings: ["Pixel Pursuit"],
        typeSpeed: 75,
        backSpeed: 30,
        startDelay: 500,
        showCursor: false,
      });

      return () => typed.destroy();
    }
  }, [showTyped]);

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, size, selectedCategory, true));
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOnPostClick = (post: IPost) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory("");
    } else setSelectedCategory(categoryName);
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && page + 1 < totalPages) {
            setPage((prev) => prev + 1);
            dispatch(fetchPosts(page + 1, size, selectedCategory));
          }
        },
        { threshold: 1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages, selectedCategory, dispatch]
  );

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={
                selectedCategory === category.name
                  ? "active selected-category"
                  : ""
              }
            >
              {category.name}
              {selectedCategory === category.name && (
                <span
                  className="clear-category"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(null);
                  }}
                >
                  ❌
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="home">
        <div className="home__header">
          <h1 className="home__title">
            <span className="welcome-text">Welcome to</span>{" "}
            <span id="home__blog-title" ref={typedElement}>
              {"பிக்ஸல் பர்ஸ்யூட்"}
            </span>
          </h1>
        </div>

        <div className="home__posts">
          {posts.length === 0 && !loading ? (
            <p className="no-posts">No posts found. (404)</p>
          ) : (
            posts.map((post, index) => {
              if (index === posts.length - 1) {
                return (
                  <div ref={lastPostRef} key={post.id}>
                    <Post post={post} handleOnPostClick={handleOnPostClick} />
                  </div>
                );
              } else {
                return (
                  <Post
                    key={post.id}
                    post={post}
                    handleOnPostClick={handleOnPostClick}
                  />
                );
              }
            })
          )}
        </div>

        {loading && <Loading />}
      </div>
    </div>
  );
};

export default Home;
