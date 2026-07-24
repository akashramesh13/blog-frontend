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

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Home: React.FC = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { posts, categories, loading, totalPages } = useSelector(
    (state: RootState) => state.posts,
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const size = 5;
  const observer = useRef<IntersectionObserver | null>(null);

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, size, selectedCategory, debouncedSearch, true, sortBy));
  }, [selectedCategory, debouncedSearch, sortBy, dispatch]);

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
            dispatch(fetchPosts(page + 1, size, selectedCategory, debouncedSearch, false, sortBy));
          }
        },
        { threshold: 1 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages, selectedCategory, debouncedSearch, sortBy, dispatch],
  );

  return (
    <div className="home-container">
      <div className="home">
        <div className="home__header">
          <h1 className="home__title">
            <span className="welcome-text">Welcome to</span>
            <span id="home__blog-title">Pixel Pursuit</span>
          </h1>

          <div className="home__filters" style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
            <input
              type="text"
              className="home__search"
              placeholder="Search stories by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="home__sort"
              style={{ 
                padding: '10px 15px', 
                borderRadius: '8px', 
                border: '1px solid #ccc',
                fontFamily: 'inherit'
              }}
            >
              <option value="latest">Latest</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>

          <div className="categories-inline">
            {categories.map((category) => (
              <span
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={selectedCategory === category.name ? "active" : ""}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <div className="home__posts">
          {posts.length === 0 && !loading ? (
            <p className="no-posts">No posts found.</p>
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
