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

import { verifyPost, handleStrike, isUserRestricted } from "../services/verificationService.js";

router.post("/", async (req, res) => {
  try {
    const user = req.user;

    // ── Check if user is restricted ──────────────────────────
    if (isUserRestricted(user)) {
      const until = new Date(user.restrictedUntil).toLocaleString();
      return res.status(403).json({
        message: `You are temporarily restricted from posting until ${until}.`,
      });
    }

    const { content, media } = req.body;

    // ── Run verification pipeline ─────────────────────────────
    const verification = await verifyPost(content);

    if (!verification.approved) {
      // Issue a strike for rejected posts
      const strikeCount = await handleStrike(user);
      return res.status(422).json({
        message: "Post rejected",
        reason: verification.rejectionReason,
        strikes: strikeCount,
      });
    }

    // ── Upload media to Cloudinary (your existing logic) ──────
    let uploadedMedia = [];
    if (media?.length) {
      uploadedMedia = await uploadMediaToCloudinary(media); // your existing fn
    }

    // ── Save post with verification & AI flag ─────────────────
    const post = await Post.create({
      author: user._id,
      authorModel: user.role === "alumni" ? "Alumni" : "Student",
      content,
      media: uploadedMedia,
      verification: {
        status: "approved",
        checkedAt: new Date(),
      },
      aiDetection: {
        flag: verification.aiFlag,
        score: verification.aiScore,
      },
    });

    const populated = await post.populate("author", "name avatar role");
    res.status(201).json({ post: populated });

  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;