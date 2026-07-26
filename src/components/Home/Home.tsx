import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
    setSelectedCategory(params.get("category") || null);
  }, [location.search]);
  const [sortBy, setSortBy] = useState("latest");
  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const isSearchOrFilter = !!(debouncedSearch || selectedCategory);
  
  const [visibleCount, setVisibleCount] = useState(isSearchOrFilter ? 6 : 4);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // eslint-disable-next-line
  const [featuredPost, setFeaturedPost] = useState<IPost | null>(null);

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    setVisibleCount(isSearchOrFilter ? 6 : 4);
    dispatch(fetchPosts(0, 12, selectedCategory, debouncedSearch, true, sortBy));
  }, [selectedCategory, debouncedSearch, sortBy, dispatch, isSearchOrFilter]);

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

  const displayedPosts = posts.slice(0, visibleCount);
  const hasMoreToDisplay = visibleCount < posts.length;
  const hasMoreToFetch = page < totalPages - 1;
  const showLoadMore = hasMoreToDisplay || hasMoreToFetch;

  return (
    <div className="home-container">
      <div className="home">
        <div className="home__header">
          <h1 className="home__title">
            <span id="home__blog-title">Pixel Pursuit</span>
          </h1>

          <div className="home__search-container" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <input
              type="text"
              className="home__search"
              placeholder="Search stories by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ margin: 0, paddingRight: '120px' }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="home__sort"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                margin: 0,
                padding: '4px 8px',
                fontSize: '0.85rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
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
          {loading && posts.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Loading />
            </div>
          ) : posts.length === 0 && !loading ? (
            <p className="no-posts">No posts found.</p>
          ) : (
            <>
              {!isSearchOrFilter && displayedPosts.length > 0 && (
                <div className="home__hero">
                  <Post
                    post={featuredPost ? featuredPost : displayedPosts[0]}
                    handleOnPostClick={handleOnPostClick}
                    isHero={true}
                  />
                </div>
              )}
              {(displayedPosts.length > (isSearchOrFilter ? 0 : 1) || (featuredPost && displayedPosts.length > 0)) && (
                <div className="home__grid">
                  {displayedPosts
                    .filter(p => !(featuredPost && !isSearchOrFilter && p.id === featuredPost.id))
                    .filter((p, idx) => (isSearchOrFilter || featuredPost) ? true : idx > 0)
                    .map((post, index) => {
                      return (
                        <div key={post.id} className="grid-item-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                          <Post post={post} handleOnPostClick={handleOnPostClick} isGridCard={true} />
                        </div>
                      );
                    })}
                </div>
              )}
              {showLoadMore && (
                <div className="load-more-container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                  <button
                    className="btn-secondary load-more-btn"
                    disabled={loading}
                    onClick={() => {
                      const nextVisibleCount = visibleCount + 3;
                      setVisibleCount(nextVisibleCount);
                      if (nextVisibleCount > posts.length && hasMoreToFetch) {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        dispatch(fetchPosts(nextPage, 12, selectedCategory, debouncedSearch, false, sortBy));
                      }
                    }}
                  >
                    {loading ? <Loading inline /> : "Load More Articles"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
