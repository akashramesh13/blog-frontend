import React, { useEffect, useRef, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { fetchPosts, clearPosts } from "../../redux/actions/postsActions";
import Post from "../Post/Post";
import "./Essays.scss";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { IPost } from "../../types/postsTypes";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

const Essays: React.FC = () => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { posts, loading, totalPages } = useSelector(
    (state: RootState) => state.posts,
  );

  const [page, setPage] = useState(0);
  const size = 10;
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    dispatch(clearPosts());
    setPage(0);
    dispatch(fetchPosts(0, size, null, "", true, "latest"));
  }, [dispatch]);

  const handleOnPostClick = (post: IPost) => {
    history.push(`/post/view/${post.id}`, post);
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && page + 1 < totalPages) {
            setPage((prev) => prev + 1);
            dispatch(fetchPosts(page + 1, size, null, "", false, "latest"));
          }
        },
        { threshold: 1 },
      );

      if (node) observer.current.observe(node);
    },
    [loading, page, totalPages, dispatch],
  );

  return (
    <div className="essays-container">
      <div className="essays-header">
        <h1>All Essays</h1>
        <p>Explore the complete archive of Pixel Pursuit.</p>
      </div>

      <div className="essays-grid">
        {posts.map((post, index) => {
          const isLast = index === posts.length - 2;
          return (
            <div ref={isLast ? lastPostRef : null} key={post.id} className="grid-item-wrapper">
              <Post post={post} handleOnPostClick={handleOnPostClick} />
            </div>
          );
        })}
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default Essays;
