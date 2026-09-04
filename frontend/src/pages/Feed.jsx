import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getPosts,
} from "../api/post.api";

import useAuth from "../hooks/useAuth";

import CreatePost from "../components/posts/CreatePost";
import PostCard from "../components/posts/PostCard";

const LIMIT = 10;

const Feed = () => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(false);

  const extractPosts = (
    response
  ) => {
    if (
      Array.isArray(response)
    ) {
      return response;
    }

    if (
      Array.isArray(
        response.posts
      )
    ) {
      return response.posts;
    }

    if (
      Array.isArray(
        response.data?.posts
      )
    ) {
      return response.data.posts;
    }

    if (
      Array.isArray(
        response.data
      )
    ) {
      return response.data;
    }

    return [];
  };

  const getPagination = (
    response
  ) => {
    return (
      response.pagination ||
      response.data?.pagination ||
      {}
    );
  };

  const fetchPosts =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getPosts(
              1,
              LIMIT
            );

          console.log(
            "Feed response:",
            response
          );

          const postList =
            extractPosts(
              response
            );

          const pagination =
            getPagination(
              response
            );

          setPosts(postList);

          setHasMore(
            Boolean(
              pagination.hasNextPage
            )
          );

          setPage(1);
        } catch (err) {
          console.error(
            "Feed error:",
            err
          );

          setError(
            err.response?.data
              ?.message ||
              "Unable to load posts."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (
    newPost
  ) => {
    setPosts((current) => [
      newPost,
      ...current,
    ]);
  };

  const handlePostUpdated = (
    updatedPost
  ) => {
    if (!updatedPost?._id) {
      return;
    }

    setPosts((current) =>
      current.map((post) =>
        post._id ===
        updatedPost._id
          ? updatedPost
          : post
      )
    );
  };

  const handleLoadMore =
    async () => {
      if (
        loadingMore ||
        !hasMore
      ) {
        return;
      }

      try {
        setLoadingMore(true);

        const nextPage =
          page + 1;

        const response =
          await getPosts(
            nextPage,
            LIMIT
          );

        const newPosts =
          extractPosts(
            response
          );

        const pagination =
          getPagination(
            response
          );

        setPosts(
          (current) => {
            const ids =
              new Set(
                current.map(
                  (post) =>
                    post._id
                )
              );

            const unique =
              newPosts.filter(
                (post) =>
                  !ids.has(
                    post._id
                  )
              );

            return [
              ...current,
              ...unique,
            ];
          }
        );

        setPage(nextPage);

        setHasMore(
          Boolean(
            pagination.hasNextPage
          )
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Unable to load more posts."
        );
      } finally {
        setLoadingMore(false);
      }
    };

  return (
    <div className="feed-page">

      <header className="feed-header">

        <div className="feed-header-inner">

          <Link
            to="/feed"
            className="feed-brand"
          >
            <span className="brand-logo">
              S
            </span>

            <span>
              Social
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="user-chip">

              <span className="user-chip-avatar">
                {user?.username
                  ?.charAt(0)
                  .toUpperCase()}
              </span>

              <span>
                {user?.username}
              </span>

            </div>
          ) : (
            <Link
              to="/login"
              className="header-login-button"
            >
              Login
            </Link>
          )}

        </div>

      </header>

      <main className="feed-main">

        <div className="feed-heading">

          <p className="feed-eyebrow">
            COMMUNITY
          </p>

          <h1>
            Social Feed
          </h1>

          <p>
            Discover what people
            are sharing.
          </p>

        </div>

        {isAuthenticated && (
          <CreatePost
            onPostCreated={
              handlePostCreated
            }
          />
        )}

        {error && (
          <div className="feed-alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="feed-loading">

            <div className="spinner" />

            <p>
              Loading posts...
            </p>

          </div>
        ) : posts.length === 0 ? (
          <div className="empty-feed">

            <div className="empty-icon">
              ✦
            </div>

            <h2>
              No posts yet
            </h2>

            <p>
              Be the first to
              share something.
            </p>

          </div>
        ) : (
          <div className="posts-list">

            {posts.map(
              (post) => (
                <PostCard
                  key={
                    post._id
                  }
                  post={post}
                  onPostUpdated={
                    handlePostUpdated
                  }
                />
              )
            )}

          </div>
        )}

        {!loading &&
          hasMore && (
            <div className="load-more-wrapper">

              <button
                className="load-more-button"
                onClick={
                  handleLoadMore
                }
                disabled={
                  loadingMore
                }
              >
                {loadingMore
                  ? "Loading..."
                  : "Load more posts"}
              </button>

            </div>
          )}

        {!loading &&
          posts.length > 0 &&
          !hasMore && (
            <div className="feed-end">
              You've reached the
              end of the feed.
            </div>
          )}

      </main>

    </div>
  );
};

export default Feed;