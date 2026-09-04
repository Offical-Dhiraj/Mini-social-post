import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addComment,
  toggleLike,
} from "../../api/post.api";

import useAuth from "../../hooks/useAuth";
import { getImageUrl } from "../../utils/image";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

/* =====================================================
   ICONS
===================================================== */

const HeartIcon = ({ filled = false }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 1 1 17 0z" />
  </svg>
);

const MoreIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
    />

    <circle
      cx="8.5"
      cy="8.5"
      r="1.5"
    />

    <path d="M21 15l-5-5L5 21" />
  </svg>
);

/* =====================================================
   POST CARD
===================================================== */

const PostCard = ({
  post,
  onPostUpdated,
}) => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  /*
   * ---------------------------------------------------
   * USER / AUTHOR
   * ---------------------------------------------------
   */

  const username =
    post.author?.username ||
    post.user?.username ||
    post.username ||
    "User";

  const authorId =
    post.author?.userId ||
    post.author?._id ||
    post.user?.userId ||
    post.user?._id ||
    post.userId;

  const currentUserId =
    user?.id ||
    user?._id;

  const isOwnPost =
    Boolean(currentUserId) &&
    Boolean(authorId) &&
    String(currentUserId) ===
    String(authorId);

  /*
   * ---------------------------------------------------
   * IMAGE
   * ---------------------------------------------------
   */

  const imageUrl = useMemo(() => {
    return getImageUrl(post.image);
  }, [post.image]);

  const [imageError, setImageError] =
    useState(false);

  /*
   * ---------------------------------------------------
   * INITIAL LIKES
   * ---------------------------------------------------
   */

  const initialLikeCount =
    typeof post.likeCount === "number"
      ? post.likeCount
      : Array.isArray(post.likes)
        ? post.likes.length
        : 0;

  /*
   * ---------------------------------------------------
   * INITIAL COMMENTS
   * ---------------------------------------------------
   */

  const initialComments =
    Array.isArray(post.comments)
      ? post.comments
      : [];

  const initialCommentCount =
    typeof post.commentCount === "number"
      ? post.commentCount
      : initialComments.length;

  /*
   * ---------------------------------------------------
   * CHECK LIKE
   * ---------------------------------------------------
   */

  const checkLiked = () => {
    if (
      !user ||
      !Array.isArray(post.likes)
    ) {
      return false;
    }

    return post.likes.some((like) => {
      if (typeof like === "string") {
        return (
          like === user.username
        );
      }

      return (
        String(
          like.userId ||
          like._id ||
          ""
        ) ===
        String(
          user.id ||
          user._id ||
          ""
        ) ||
        like.username ===
        user.username
      );
    });
  };

  /*
   * ---------------------------------------------------
   * STATE
   * ---------------------------------------------------
   */

  const [liked, setLiked] =
    useState(checkLiked);

  const [likeCount, setLikeCount] =
    useState(initialLikeCount);

  const [comments, setComments] =
    useState(initialComments);

  const [commentCount, setCommentCount] =
    useState(initialCommentCount);

  const [liking, setLiking] =
    useState(false);

  const [commenting, setCommenting] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ---------------------------------------------------
   * SYNC WITH SERVER DATA
   * ---------------------------------------------------
   */

  useEffect(() => {
    const nextLikeCount =
      typeof post.likeCount === "number"
        ? post.likeCount
        : Array.isArray(post.likes)
          ? post.likes.length
          : 0;

    setLikeCount(nextLikeCount);

    setLiked(checkLiked());

    const nextComments =
      Array.isArray(post.comments)
        ? post.comments
        : [];

    setComments(nextComments);

    setCommentCount(
      typeof post.commentCount === "number"
        ? post.commentCount
        : nextComments.length
    );

    setImageError(false);
  }, [post]);

  /*
   * ---------------------------------------------------
   * LIKE
   * ---------------------------------------------------
   */

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError(
        "Please login to like posts."
      );

      return;
    }

    if (isOwnPost) {
      setError(
        "You cannot like your own post."
      );

      return;
    }

    if (liking) {
      return;
    }

    const oldLiked = liked;
    const oldCount = likeCount;

    /*
     * Instant UI update
     */
    setLiked(!oldLiked);

    setLikeCount((count) =>
      oldLiked
        ? Math.max(0, count - 1)
        : count + 1
    );

    setLiking(true);
    setError("");

    try {
      const response =
        await toggleLike(post._id);

      const data =
        response.data || response;

      if (
        typeof data.liked ===
        "boolean"
      ) {
        setLiked(data.liked);
      }

      if (
        typeof data.likeCount ===
        "number"
      ) {
        setLikeCount(
          data.likeCount
        );
      } else if (
        Array.isArray(data.likes)
      ) {
        setLikeCount(
          data.likes.length
        );
      }

      if (data.post) {
        onPostUpdated?.(
          data.post
        );
      }
    } catch (err) {
      /*
       * Rollback if request fails
       */
      setLiked(oldLiked);
      setLikeCount(oldCount);

      setError(
        err.response?.data
          ?.message ||
        "Unable to update like."
      );
    } finally {
      setLiking(false);
    }
  };

  /*
   * ---------------------------------------------------
   * COMMENT
   * ---------------------------------------------------
   */

  const handleComment = async (
    content
  ) => {
    if (!isAuthenticated) {
      setError(
        "Please login to comment."
      );

      return false;
    }

    if (commenting) {
      return false;
    }

    setCommenting(true);
    setError("");

    try {
      const response =
        await addComment(
          post._id,
          content
        );

      const data =
        response.data || response;

      if (
        Array.isArray(
          data.comments
        )
      ) {
        setComments(
          data.comments
        );

        setCommentCount(
          data.comments.length
        );
      } else if (
        data.comment
      ) {
        setComments(
          (current) => [
            ...current,
            data.comment,
          ]
        );

        setCommentCount(
          (count) => count + 1
        );
      }

      if (
        typeof data.commentCount ===
        "number"
      ) {
        setCommentCount(
          data.commentCount
        );
      }

      if (data.post) {
        onPostUpdated?.(
          data.post
        );
      }

      return true;
    } catch (err) {
      setError(
        err.response?.data
          ?.message ||
        "Unable to add comment."
      );

      return false;
    } finally {
      setCommenting(false);
    }
  };

  /*
   * ---------------------------------------------------
   * COMMENT BUTTON
   * ---------------------------------------------------
   */

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      setError(
        "Please login to comment."
      );

      return;
    }

    const commentInput =
      document.querySelector(
        `#comment-input-${post._id}`
      );

    if (commentInput) {
      commentInput.focus();

      commentInput.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  /*
   * ---------------------------------------------------
   * RENDER
   * ---------------------------------------------------
   */

  return (
    <article className="post-card">

      {/* =============================================
          HEADER
      ============================================= */}

      <div className="post-header">

        <div className="post-avatar">
          {username
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="post-author">

          <h3>
            {username}
          </h3>

          <span>
            Shared a post
          </span>

        </div>

        <button
          type="button"
          className="post-more-button"
          aria-label="Post options"
          title="Post options"
        >
          <MoreIcon />
        </button>

      </div>


      {/* =============================================
          CONTENT
      ============================================= */}

      {post.content?.trim() && (
        <div className="post-content">
          <p>
            {post.content}
          </p>
        </div>
      )}


      {/* =============================================
          IMAGE
      ============================================= */}

      {/* IMAGE */}

      {imageUrl && !imageError && (
        <div className="post-image-wrapper">
          <img
            src={imageUrl}
            alt={`Post by ${username}`}
            className="post-image"
            loading="lazy"
            onLoad={() => {
              console.log(
                "Post image loaded:",
                imageUrl
              );
            }}
            onError={(event) => {
              console.error(
                "Post image failed:",
                imageUrl
              );

              event.currentTarget.style.display =
                "none";

              setImageError(true);
            }}
          />
        </div>
      )}

      {imageUrl && imageError && (
        <div className="post-image-error">
          <ImageIcon />

          <strong>
            Image couldn't be loaded
          </strong>

          <span>
            Please try refreshing the feed.
          </span>
        </div>
      )}

      {/* =============================================
          STATISTICS
      ============================================= */}

      <div className="post-stats">

        <div className="like-stat">

          {likeCount > 0 && (
            <span className="small-heart">
              <HeartIcon filled />
            </span>
          )}

          <span>
            {likeCount}{" "}
            {likeCount === 1
              ? "like"
              : "likes"}
          </span>

        </div>

        <button
          type="button"
          className="comment-stat"
          onClick={
            handleCommentClick
          }
        >
          {commentCount}{" "}
          {commentCount === 1
            ? "comment"
            : "comments"}
        </button>

      </div>


      {/* =============================================
          ACTIONS
      ============================================= */}

      <div className="post-actions">

        <button
          type="button"
          className={`post-action ${liked
              ? "post-action-liked"
              : ""
            }`}
          onClick={
            handleLike
          }
          disabled={
            !isAuthenticated ||
            isOwnPost ||
            liking
          }
          title={
            isOwnPost
              ? "You cannot like your own post"
              : !isAuthenticated
                ? "Login to like"
                : "Like this post"
          }
        >

          <span className="action-icon">
            <HeartIcon
              filled={liked}
            />
          </span>

          <span>
            {liking
              ? "Liking..."
              : liked
                ? "Liked"
                : "Like"}
          </span>

        </button>


        <button
          type="button"
          className="post-action"
          onClick={
            handleCommentClick
          }
        >

          <span className="action-icon">
            <CommentIcon />
          </span>

          <span>
            Comment
          </span>

        </button>

      </div>


      {/* =============================================
          COMMENTS
      ============================================= */}

      {isAuthenticated && (
        <div className="post-comments">

          <CommentForm
            postId={post._id}
            onSubmit={
              handleComment
            }
            loading={
              commenting
            }
          />

          <CommentList
            comments={
              comments
            }
          />

        </div>
      )}


      {/* =============================================
          ERROR
      ============================================= */}

      {error && (
        <div className="post-inline-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Close error"
          >
            ×
          </button>

        </div>
      )}

    </article>
  );
};

export default PostCard;