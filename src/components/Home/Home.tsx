import React, { useEffect, useRef, useCallback, useState } from "react";
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

const PAGE_SIZE = 5;

const Home: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { posts, categories, loading, totalPages } = useSelector(
    (state: RootState) => state.posts,
  );

  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("latest");

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Sync URL params → state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    const urlCategory = params.get("category") || null;
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Reset + initial fetch whenever filters change
  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, PAGE_SIZE, selectedCategory, debouncedSearch, true, sortBy));
  }, [selectedCategory, debouncedSearch, sortBy, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOnPostClick = (post: IPost) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  // ── Sentinel-based IntersectionObserver ──────────────────────────────────
  // We attach the observer to a sentinel div AFTER the post list, not the
  // last post itself. This ensures the load only triggers when the user has
  // actually scrolled past all rendered posts.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Stable ref for mutable values we need inside the observer callback
  const stateRef = useRef({ loading, page, totalPages, selectedCategory, debouncedSearch, sortBy });
  useEffect(() => {
    stateRef.current = { loading, page, totalPages, selectedCategory, debouncedSearch, sortBy };
  });

  const attachObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;

        const { loading: isLoading, page: curPage, totalPages: total,
                selectedCategory: cat, debouncedSearch: search, sortBy: sort } = stateRef.current;

        // Only fetch if not already loading and there are more pages
        if (!isLoading && curPage + 1 < total) {
          const nextPage = curPage + 1;
          setPage(nextPage);
          dispatch(fetchPosts(nextPage, PAGE_SIZE, cat, search, false, sort));
        }
      },
      {
        // Fire when the sentinel enters the viewport — no threshold tricks
        threshold: 0,
        // Add a small rootMargin so it loads slightly before the sentinel
        // hits the bottom edge (50px ahead = feels seamless, not eager)
        rootMargin: "0px 0px 50px 0px",
      },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [dispatch]);

  // Re-attach observer every time loading finishes (loading goes false)
  // so we're always watching the sentinel.
  useEffect(() => {
    if (!loading) {
      attachObserver();
    }
    return () => observerRef.current?.disconnect();
  }, [loading, attachObserver]);

  // Also attach when the sentinel node mounts
  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      sentinelRef.current = node;
      if (node && !loading) {
        attachObserver();
      }
    },
    [loading, attachObserver],
  );

  const isInitialLoad = loading && posts.length === 0;
  const isLoadingMore = loading && posts.length > 0;
  const hasMore = page + 1 < totalPages;

  return (
    <div className="home-container">
      <div className="home">
        <div className="home__header">
          <h1 className="home__title">
            <span className="welcome-text">Welcome to</span>
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
          {isInitialLoad ? (
            <Loading />
          ) : posts.length === 0 && !loading ? (
            <p className="no-posts">No posts found.</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                handleOnPostClick={handleOnPostClick}
              />
            ))
          )}
        </div>

        {/* Sentinel — sits below the post list; observed for scroll-triggered loads */}
        {!isInitialLoad && <div ref={setSentinel} className="scroll-sentinel" />}

        {/* Bottom spinner — only shown while paginating (not initial load) */}
        {isLoadingMore && (
          <div className="home__load-more-spinner">
            <Loading inline />
          </div>
        )}

        {/* End-of-feed message */}
        {!loading && !hasMore && posts.length > 0 && (
          <p className="home__end-message">You've reached the end</p>
        )}
      </div>
    </div>
  );
};

export default Home;
