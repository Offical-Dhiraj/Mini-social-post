const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    let image = null;

    if (req.file) {
      image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    const post = await postService.createPost({
      userId: req.user.id,
      username: req.user.username,
      content,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await postService.getPosts({
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const result = await postService.likePost({
      postId: req.params.postId,
      userId: req.user.id,
      username: req.user.username,
    });

    return res.status(200).json({
      success: true,
      message: result.liked
        ? "Post liked"
        : "Post unliked",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const result = await postService.addComment({
      postId: req.params.postId,
      userId: req.user.id,
      username: req.user.username,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
};