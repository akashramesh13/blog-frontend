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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]);

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
        <header className="home__header">
          <h1 className="home__title">Pixel Pursuit</h1>
          <p className="home__intro">
            Writing on engineering, design, and ideas that matter.
          </p>

          <div className="home__controls">
            <div className="home__search-box">
              <svg
                className="home__search-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="home__search-input"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="home__sort-container" ref={sortRef}>
                <button
                  type="button"
                  className={`home__sort-btn ${isSortOpen ? "open" : ""}`}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  aria-label="Sort stories"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <span>{sortBy === "latest" ? "Latest" : "Top"}</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isSortOpen && (
                  <div className="home__sort-menu" role="listbox">
                    <button
                      type="button"
                      className={`home__sort-option ${sortBy === "latest" ? "selected" : ""}`}
                      onClick={() => {
                        setSortBy("latest");
                        setIsSortOpen(false);
                      }}
                      role="option"
                      aria-selected={sortBy === "latest"}
                    >
                      <span>Latest</span>
                      {sortBy === "latest" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      className={`home__sort-option ${sortBy === "likes" ? "selected" : ""}`}
                      onClick={() => {
                        setSortBy("likes");
                        setIsSortOpen(false);
                      }}
                      role="option"
                      aria-selected={sortBy === "likes"}
                    >
                      <span>Top</span>
                      {sortBy === "likes" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="home__categories-filter">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`home__category-tab ${
                    selectedCategory === category.name ? "active" : ""
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="home__feed">
          {isInitialLoad ? (
            <Loading />
          ) : posts.length === 0 && !loading ? (
            <p className="no-posts">No stories found.</p>
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
            <Loading inline size="large" />
            <span className="home__load-more-text">Loading more stories...</span>
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
