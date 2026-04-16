import express from "express";
import {
  getAlumni,
  getUserById,
  updateProfile,
  upgradePlan,
  getEnrolledItems,
} from "../controllers/user.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────

// Get all alumni (networking page)
router.get("/alumni", getAlumni);

// ─────────────────────────────
// PROTECTED ROUTES
// ─────────────────────────────
router.use(protect);

// Update profile (includes avatar upload already)
router.put("/profile", updateProfile);

// Upgrade alumni plan (simple → premium)
router.patch("/upgrade-plan", upgradePlan);

// Get enrolled items (courses + sessions)
router.get("/me/enrolled", getEnrolledItems);

// Get single user profile (MUST be last route so it doesn't match the above endpoints)
router.get("/:id", getUserById);

export default router;