const mongoose = require("mongoose");
const Post = require("../models/Post");

const createPost = async ({
  userId,
  username,
  content,
  image,
}) => {
  const normalizedContent = content?.trim() || "";

  const hasContent = normalizedContent.length > 0;
  const hasImage = Boolean(image);

  if (!hasContent && !hasImage) {
    const error = new Error(
      "Post must contain text, image, or both"
    );

    error.statusCode = 400;
    throw error;
  }

  const post = await Post.create({
    author: {
      userId,
      username,
    },

    content: normalizedContent,

    image: image
      ? {
          url: image.url,
          publicId: image.publicId || null,
        }
      : {
          url: null,
          publicId: null,
        },
  });

  return post;
};

const getPosts = async ({ page = 1, limit = 10 }) => {
  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 20);

  const skip = (currentPage - 1) * pageSize;

  const [posts, totalPosts] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    Post.countDocuments(),
  ]);

  return {
    posts,
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize),
      hasNextPage: currentPage * pageSize < totalPosts,
    },
  };
};

const likePost = async ({ postId, userId, username }) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const error = new Error("Invalid post ID");
    error.statusCode = 400;
    throw error;
  }

  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const existingLike = post.likes.find(
    (like) => like.userId.toString() === userId.toString()
  );

  if (existingLike) {
    post.likes = post.likes.filter(
      (like) => like.userId.toString() !== userId.toString()
    );
  } else {
    post.likes.push({
      userId,
      username,
    });
  }

  await post.save();

  return {
    postId: post._id,
    liked: !existingLike,
    likeCount: post.likes.length,
  };
};

const addComment = async ({
  postId,
  userId,
  username,
  content,
}) => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    const error = new Error("Invalid post ID");
    error.statusCode = 400;
    throw error;
  }

  const normalizedContent = content?.trim();

  if (!normalizedContent) {
    const error = new Error("Comment content is required");
    error.statusCode = 400;
    throw error;
  }

  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  post.comments.push({
    userId,
    username,
    content: normalizedContent,
  });

  await post.save();

  const comment =
    post.comments[post.comments.length - 1];

  return {
    comment,
    commentCount: post.comments.length,
  };
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
};