import Alumni from '../models/Alumni.js';
import Student from '../models/Student.js';
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

    let userPayload = user.toObject ? user.toObject() : { ...user };

    if (req.user?.role === "student" && userPayload.role === "alumni") {
      const student = await Student.findById(req.user._id).select("takenMemberships");
      const hasTakenMembership = (student?.takenMemberships || []).some(
        (item) => String(item.alumni) === String(userPayload._id)
      );
      userPayload.membershipTaken = hasTakenMembership;
      userPayload.subscribed = hasTakenMembership;
    }

    res.json({ user: userPayload });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// TAKE ALUMNI MEMBERSHIP (STUDENT)
// ─────────────────────────────────────────────
export const takeAlumniMembership = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can take membership." });
    }

    const alumniId = req.params.id;
    const alumni = await Alumni.findById(alumniId).select("_id alumniMembershipActive");
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    if (!alumni.alumniMembershipActive) {
      return res.status(400).json({ message: "This alumni membership is not active yet." });
    }

    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const alreadyTaken = (student.takenMemberships || []).some(
      (item) => String(item.alumni) === String(alumniId)
    );

    if (!alreadyTaken) {
      student.takenMemberships.push({ alumni: alumniId, takenAt: new Date() });
      await student.save();
    }

    res.json({
      message: alreadyTaken ? "Membership already active" : "Membership activated",
      membershipTaken: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE PROFILE
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { 
      name, email, about, title, skills, college, company, avatar, coverPhoto, alumniPlan,
      joiningYear, passingYear, degree, branch
    } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (about) updates.about = about;
    if (title) updates.title = title;

    // ✅ FIX skills handling
    if (skills) {
      updates.skills = Array.isArray(skills) ? skills : skills.split(",");
    }

    if (college) updates.college = college;
    if (company) updates.company = company;
    if (joiningYear) updates.joiningYear = joiningYear;
    if (passingYear) updates.passingYear = passingYear;
    if (degree) updates.degree = degree;
    if (branch) updates.branch = branch;

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

// ─────────────────────────────────────────────
// ADD REVIEW TO ALUMNI
// ─────────────────────────────────────────────
export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // Alumni ID
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid rating between 1 and 5 is required." });
    }

    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Check if student already left a review
    const existingIndex = alumni.reviews.findIndex(r => r.student?.toString() === req.user._id.toString());
    
    if (existingIndex > -1) {
      // Update existing
      alumni.reviews[existingIndex].rating = rating;
      alumni.reviews[existingIndex].reviewText = comment;
      alumni.reviews[existingIndex].date = Date.now();
    } else {
      // Create new
      alumni.reviews.push({
        student: req.user._id,
        rating,
        reviewText: comment,
      });
    }

    await alumni.save();

    // Re-fetch populated reviews
    const updatedAlumni = await Alumni.findById(id).populate({
      path: "reviews.student",
      select: "name avatar headline role",
    });

    res.status(201).json({
      message: "Review submitted successfully",
      reviews: updatedAlumni.reviews,
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET ALUMNI WITH MEMBERSHIP FLAG (AUTH)
// ─────────────────────────────────────────────
export const getAlumniWithMembership = async (req, res) => {
  try {
    const { name, college, page = 1, limit = 20 } = req.query;

    const filter = { isSuspended: { $ne: true } };

    // Students should only discover alumni who have activated membership.
    if (req.user?.role === "student") {
      filter.alumniMembershipActive = true;
    }

    if (name) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escapedName, $options: "i" };
    }

    if (college) {
      filter.college = { $regex: college, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const alumniRows = await Alumni.find(filter)
      .select("name email college company role avatar about skills alumniPlan alumniMembershipActive")
      .skip(skip)
      .limit(Number(limit))
      .sort({ isVerified: -1, createdAt: -1 })
      .lean();

    let membershipSet = new Set();
    let membershipDateMap = new Map();
    if (req.user?.role === "student") {
      const student = await Student.findById(req.user._id).select("takenMemberships").lean();
      const taken = student?.takenMemberships || [];
      membershipSet = new Set(taken.map((item) => String(item.alumni)));
      membershipDateMap = new Map(
        taken.map((item) => [String(item.alumni), item.takenAt || null])
      );
    }

    const alumni = alumniRows.map((row) => ({
      ...row,
      membershipTaken: membershipSet.has(String(row._id)),
      subscribed: membershipSet.has(String(row._id)),
      membershipTakenAt: membershipDateMap.get(String(row._id)) || null,
      priceMonth: 199,
    }));

    res.json({ alumni });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// ACTIVATE ALUMNI MEMBERSHIP (ALUMNI)
// ─────────────────────────────────────────────
export const activateAlumniMembership = async (req, res) => {
  try {
    if (req.user.role !== "alumni") {
      return res.status(403).json({ message: "Only alumni can activate membership." });
    }

    const alumni = await Alumni.findById(req.user._id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    if (!alumni.alumniMembershipActive) {
      alumni.alumniMembershipActive = true;
      alumni.alumniMembershipStartedAt = new Date();
      if (alumni.alumniPlan !== "premium") {
        alumni.alumniPlan = "premium";
      }
      await alumni.save();
    }

    res.json({
      message: "Alumni membership activated",
      alumniMembershipActive: true,
      user: alumni,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};