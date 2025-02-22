import React, { useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import {
  fetchPosts,
  fetchCategories,
  clearPosts,
} from "../../redux/reducers/postsReducer";
import Post from "../Post/Post";
import "./Home.scss";
import Loading from "../Loading/Loading";

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch: any = useDispatch();
  const { posts, categories, loading, totalPages } = useSelector(
    (state: RootState) => state.posts
  );

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [page, setPage] = React.useState(0);
  const size = 5;
  const observer = useRef<IntersectionObserver | null>(null);

  const trendingPosts = [
    "AI Breakthrough",
    "Stock Market Crash",
    "Best Travel Tips",
    "Healthy Diet Hacks",
  ];

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, size, selectedCategory, true));
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOnPostClick = (post: any) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
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
              className={selectedCategory === category.name ? "active" : ""}
              style={{
                cursor: "pointer",
                fontWeight:
                  selectedCategory === category.name ? "bold" : "normal",
              }}
            >
              {category.name}
            </li>
          ))}
          {selectedCategory !== null && (
            <li onClick={() => setSelectedCategory(null)}>Clear</li>
          )}
        </ul>
      </div>

      <div className="home">
        <div className="home__header">
          <h1 className="home__title">Welcome to Pixel Pursuit</h1>
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
