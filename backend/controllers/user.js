import Alumni from '../models/Alumni.js';
import Course from "../models/Course.js";
import Session from "../models/Session.js";
import { uploadImage } from "../config/cloudinary.js";
import {
  findUserById,
  getUserModelByRole,
} from "../utils/userModels.js";

// ─────────────────────────────────────────────
// GET ALUMNI
// ─────────────────────────────────────────────
export const getAlumni = async (req, res) => {
  try {
    const { name, college, isPremium, has24h, page = 1, limit = 12 } = req.query;

    const filter = { isSuspended: { $ne: true } };

    if (name) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escapedName, $options: "i" };
    }

    if (college) {
      filter.college = { $regex: college, $options: "i" };
    }

    if (isPremium === "true") {
      filter.alumniPlan = "premium";
    }

    if (has24h === "true") {
      filter.has24hReply = true;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Alumni.countDocuments(filter);

    const alumni = await Alumni.find(filter)
      .select(
        "name email college company avatar about skills alumniPlan isVerified has24hReply isCollegePartner"
      )
      .skip(skip)
      .limit(Number(limit))
      .sort({ isVerified: -1, createdAt: -1 }); // ✅ FIXED (removed tokens)

    res.json({
      alumni,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET USER BY ID
// ─────────────────────────────────────────────
export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, about, title, skills, college, company, avatar, coverPhoto, alumniPlan } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (about) updates.about = about;
    if (title) updates.title = title;

    // ✅ FIX skills handling
    if (skills) {
      updates.skills = Array.isArray(skills) ? skills : skills.split(",");
    }

    if (college) updates.college = college;
    if (company) updates.company = company;

    // ✅ Allow alumni plan upgrade from profile update
    if (alumniPlan && req.user.role === "alumni") {
      updates.alumniPlan = alumniPlan;
    }

    // ✅ avatar upload
    if (avatar && avatar.startsWith("data:")) {
      const { url } = await uploadImage(avatar, "avatars");
      updates.avatar = url;
    }

    // ✅ cover upload
    if (coverPhoto && coverPhoto.startsWith("data:")) {
      const { url } = await uploadImage(coverPhoto, "covers");
      updates.coverPhoto = url;
    }

    const userModel = getUserModelByRole(req.user.role);

    if (!userModel) {
      return res.status(400).json({ message: "Unsupported user role" });
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      )
      .select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// UPGRADE PLAN
// ─────────────────────────────────────────────
export const upgradePlan = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({
        message: "Only alumni can upgrade plans",
      });
    }

    const { plan } = req.body;

    if (!["simple", "premium"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await Alumni.findByIdAndUpdate(
      req.user._id,
      { alumniPlan: plan },
      { new: true }
    ).select("-password");

    res.json({
      message: `Plan upgraded to ${plan}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET ENROLLED ITEMS (FOR STUDENT)
// ─────────────────────────────────────────────
export const getEnrolledItems = async (req, res) => {
  try {
    const studentId = req.user._id;

    const [courses, sessions] = await Promise.all([
      Course.find({ "enrolledStudents.student": studentId }).populate("instructor", "name avatar title"),
      Session.find({ "enrolledStudents.student": studentId }).populate("instructor", "name avatar title")
    ]);

    const mappedCourses = courses.map(c => ({
      ...c.toObject(),
      id: c._id,
      type: "course"
    }));

    const mappedSessions = sessions.map(s => ({
      ...s.toObject(),
      id: s._id,
      type: s.type || "session"
    }));

    res.json({ success: true, enrollments: [...mappedCourses, ...mappedSessions] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};