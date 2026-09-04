const express = require("express");

const postController = require("../controllers/post.controller");
const authenticate = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

/*
 * Public feed
 */
router.get("/", postController.getPosts);

/*
 * Authenticated post creation
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  postController.createPost
);

/*
 * Authenticated like/unlike
 */
router.post(
  "/:postId/like",
  authenticate,
  postController.likePost
);

/*
 * Authenticated comment
 */
router.post(
  "/:postId/comments",
  authenticate,
  postController.addComment
);

module.exports = router;