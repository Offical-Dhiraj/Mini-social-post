import { useState } from "react";

const CommentForm = ({
  postId,
  onSubmit,
  loading = false,
}) => {
  const [content, setContent] =
    useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const value =
      content.trim();

    if (
      !value ||
      loading
    ) {
      return;
    }

    const success =
      await onSubmit(value);

    if (success) {
      setContent("");
    }
  };

  return (
    <form
      id={`comment-form-${postId}`}
      className="comment-form"
      onSubmit={
        handleSubmit
      }
    >

      <div className="comment-input-wrapper">

        <span className="comment-input-avatar">
          U
        </span>

        <input
          id={`comment-input-${postId}`}
          type="text"
          value={content}
          onChange={(event) =>
            setContent(
              event.target.value
            )
          }
          placeholder="Write a comment..."
          maxLength={500}
          disabled={loading}
          aria-label="Write a comment"
        />

      </div>

      <button
        type="submit"
        disabled={
          loading ||
          !content.trim()
        }
      >
        {loading
          ? "..."
          : "Post"}
      </button>

    </form>
  );
};

export default CommentForm;