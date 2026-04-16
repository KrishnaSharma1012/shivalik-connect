import express from "express";
import {
  getPosts,
  getMyPosts,
  getPostsByUser,
  createPost,
  editPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
} from "../controllers/post.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────
// APPLY AUTH MIDDLEWARE
// ─────────────────────────────
router.use(protect);

// ─────────────────────────────
// POSTS
// ─────────────────────────────

// Get all posts
router.get("/", getPosts);

// Get my posts (must come before /:id)
router.get("/my", getMyPosts);

// Get posts by specific user
router.get("/user/:userId", getPostsByUser);

// Create post
router.post("/", createPost);

// Edit post
router.put("/:id", editPost);

// Delete post
router.delete("/:id", deletePost);

// Like / Unlike post
router.post("/:id/like", toggleLike);

// ─────────────────────────────
// COMMENTS
// ─────────────────────────────

// Add comment
router.post("/:id/comment", addComment);

// Delete comment (FIXED param naming)
router.delete("/:id/comment/:commentId", deleteComment);

export default router;