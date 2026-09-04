import {
  useEffect,
  useRef,
  useState,
} from "react";

import { createPost } from "../../api/post.api";
import useAuth from "../../hooks/useAuth";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const CreatePost = ({
  onPostCreated,
}) => {
  const { user } = useAuth();

  const [content, setContent] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fileInputRef =
    useRef(null);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl =
      URL.createObjectURL(image);

    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select a valid image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      setError(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";
      return;
    }

    setImage(file);
  };

  const removeImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const text = content.trim();

    if (!text && !image) {
      setError(
        "Add text or an image before posting."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData =
        new FormData();

      if (text) {
        formData.append(
          "content",
          text
        );
      }

      if (image) {
        /*
         * IMPORTANT:
         * Must match multer:
         *
         * upload.single("image")
         */
        formData.append(
          "image",
          image
        );
      }

      const response =
        await createPost(formData);

      console.log(
        "Create post response:",
        response
      );

      const newPost =
        response.post ||
        response.data?.post ||
        response.data ||
        response;

      if (
        newPost &&
        newPost._id
      ) {
        onPostCreated(newPost);
      }

      setContent("");
      setImage(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    } catch (err) {
      console.error(
        "Create post error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-post-card">

      <div className="create-post-header">

        <div className="create-avatar">
          {user?.username
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>

        <div>
          <h2>Create a post</h2>

          <p>
            Share something with
            the community
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit}>

        <textarea
          className="create-post-textarea"
          value={content}
          onChange={(event) =>
            setContent(
              event.target.value
            )
          }
          placeholder="What's on your mind?"
          maxLength={2000}
          rows={4}
          disabled={loading}
        />

        {preview && (
          <div className="image-preview">

            <img
              src={preview}
              alt="Selected"
            />

            <button
              type="button"
              className="remove-image-button"
              onClick={removeImage}
            >
              ×
            </button>

          </div>
        )}

        {error && (
          <div className="feed-alert">
            {error}
          </div>
        )}

        <div className="create-post-footer">

          <div className="post-tools">

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={
                handleImageChange
              }
            />

            <button
              type="button"
              className="tool-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={loading}
            >
              <span>
                ▧
              </span>

              Photo
            </button>

            <span className="character-count">
              {content.length}/2000
            </span>

          </div>

          <button
            type="submit"
            className="create-post-button"
            disabled={
              loading ||
              (!content.trim() &&
                !image)
            }
          >
            {loading
              ? "Posting..."
              : "Post"}
          </button>

        </div>

      </form>

    </section>
  );
};

export default CreatePost;