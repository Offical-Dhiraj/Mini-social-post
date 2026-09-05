import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

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
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(false);

  const extractPosts = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response.posts)) {
      return response.posts;
    }

    if (Array.isArray(response.data?.posts)) {
      return response.data.posts;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  };

  const getPagination = (response) => {
    return (
      response.pagination ||
      response.data?.pagination ||
      {}
    );
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPosts(
        1,
        LIMIT
      );

      const postList =
        extractPosts(response);

      const pagination =
        getPagination(response);

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
        err.response?.data?.message ||
          "Unable to load posts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
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
        post._id === updatedPost._id
          ? updatedPost
          : post
      )
    );
  };

  const handleLoadMore = async () => {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const response = await getPosts(
        nextPage,
        LIMIT
      );

      const newPosts =
        extractPosts(response);

      const pagination =
        getPagination(response);

      setPosts((current) => {
        const ids = new Set(
          current.map(
            (post) => post._id
          )
        );

        const unique =
          newPosts.filter(
            (post) =>
              !ids.has(post._id)
          );

        return [
          ...current,
          ...unique,
        ];
      });

      setPage(nextPage);

      setHasMore(
        Boolean(
          pagination.hasNextPage
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load more posts."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="feed-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="feed-header">

        <div className="feed-header-inner">

          {/* Brand */}

          <Link
            to="/feed"
            className="feed-brand"
          >
            <span className="brand-logo">
              S
            </span>

            <span className="brand-name">
              Social
            </span>
          </Link>

          {/* Center title */}

          <div className="feed-header-title">
          </div>

          {/* User */}

          {isAuthenticated ? (
            <div className="feed-user-actions">

              <div className="user-chip">

                <span className="user-chip-avatar">
                  {user?.username
                    ?.charAt(0)
                    .toUpperCase()}
                </span>

                <span className="user-chip-name">
                  {user?.username}
                </span>

              </div>

              <button
                type="button"
                className="logout-button"
                onClick={
                  handleLogout
                }
                aria-label="Logout"
              >
                Logout
              </button>

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


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="feed-main">

        {/* Feed Intro */}

        <section className="feed-heading">

          <div>
            <p className="feed-eyebrow">
              YOUR COMMUNITY
            </p>

            <h1>
              Social Feed
            </h1>

            <p className="feed-description">
              See what people are sharing.
            </p>
          </div>

        </section>


        {/* Login message for guests */}

        {!isAuthenticated && (
          <div className="login-note">

            <div className="login-note-icon">
              ✦
            </div>

            <div>
              <strong>
                Join the conversation
              </strong>

              <p>
                Login to create posts,
                like posts and comment.
                {" "}
                <Link to="/login">
                  Login
                </Link>
              </p>
            </div>

          </div>
        )}


        {/* Create Post */}

        {isAuthenticated && (
          <CreatePost
            onPostCreated={
              handlePostCreated
            }
          />
        )}


        {/* Error */}

        {error && (
          <div className="feed-alert">
            <span>!</span>

            <p>{error}</p>
          </div>
        )}


        {/* Loading */}

        {loading ? (
          <div className="feed-loading">

            <div className="spinner" />

            <p>
              Loading your feed...
            </p>

          </div>
        ) : posts.length === 0 ? (

          /* Empty */

          <div className="empty-feed">

            <div className="empty-icon">
              ✦
            </div>

            <h2>
              No posts yet
            </h2>

            <p>
              Be the first to share
              something with the community.
            </p>

            {isAuthenticated && (
              <span className="empty-hint">
                Create your first post above.
              </span>
            )}

          </div>

        ) : (

          /* Posts */

          <div className="posts-list">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={
                  handlePostUpdated
                }
              />
            ))}

          </div>
        )}


        {/* Load More */}

        {!loading && hasMore && (
          <div className="load-more-wrapper">

            <button
              type="button"
              className="load-more-button"
              onClick={
                handleLoadMore
              }
              disabled={
                loadingMore
              }
            >
              {loadingMore ? (
                <>
                  <span className="button-spinner" />
                  Loading...
                </>
              ) : (
                "Load more posts"
              )}
            </button>

          </div>
        )}


        {/* Feed End */}

        {!loading &&
          posts.length > 0 &&
          !hasMore && (
            <div className="feed-end">

              <span className="feed-end-line" />

              <span>
                You're all caught up
              </span>

              <span className="feed-end-line" />

            </div>
          )}

      </main>

    </div>
  );
};

export default Feed;