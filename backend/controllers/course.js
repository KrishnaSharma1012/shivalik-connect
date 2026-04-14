import Course from "../models/Course.js";
import BaseUser from "../models/BaseUser.js";
import Earning from "../models/Earning.js";
import { uploadImage } from "../config/cloudinary.js";

const PLATFORM_CUT = Number(process.env.PLATFORM_CUT) || 0.20;

// ─────────────────────────────────────────────
// GET COURSES
// ─────────────────────────────────────────────
export const getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category } = req.query;

    const filter = { isApproved: true, isPublished: true };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate("instructor", "name avatar college company isVerified alumniPlan")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      courses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET MY COURSES (ALUMNI)
// ─────────────────────────────────────────────
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate("instructor", "name avatar college company isVerified alumniPlan")
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET COURSE BY ID
// ─────────────────────────────────────────────
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name avatar college company about isVerified tokens"
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// CREATE COURSE
// ─────────────────────────────────────────────
export const createCourse = async (req, res) => {
  try {
    const user = await BaseUser.findById(req.user._id); // ✅ FIX

    if (user.alumniPlan !== "premium") {
      return res.status(403).json({ message: "Upgrade to Premium to create courses" });
    }

    const { title, description, price, originalPrice, category, curriculum, thumbnail, thumbnailRatio, thumbnailFit } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    let thumbnailUrl = "";
    if (thumbnail && thumbnail.startsWith("data:")) {
      const { url } = await uploadImage(thumbnail, "courses");
      thumbnailUrl = url;
    }

    const course = await Course.create({
      instructor: req.user._id,
      title,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: category || "General",
      curriculum: curriculum || [],
      thumbnail: thumbnailUrl,
      thumbnailRatio: thumbnailRatio || "16 / 9",
      thumbnailFit: thumbnailFit || "contain",
      isApproved: true,
      isPublished: true,
    });

    await course.populate("instructor", "name avatar");

    res.status(201).json({ message: "Course submitted for approval", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE COURSE
// ─────────────────────────────────────────────
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = course.instructor.toString() === req.user._id.toString(); // ✅ FIX
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, price, originalPrice, category } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (price) course.price = Number(price);
    if (originalPrice) course.originalPrice = Number(originalPrice);
    if (category) course.category = category;

    await course.save();

    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE COURSE
// ─────────────────────────────────────────────
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = course.instructor.toString() === req.user._id.toString(); // ✅ FIX
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// ENROLL COURSE
// ─────────────────────────────────────────────
export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.isApproved) {
      return res.status(400).json({ message: "Course is not available yet" });
    }

    const userId = req.user._id;

    const alreadyEnrolled = course.enrolledStudents.some(e => e.student && e.student.toString() === userId.toString());
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Already enrolled in this course" });
    }

    const { paymentMethod, amountPaid, paymentId } = req.body;

    // enroll
    course.enrolledStudents.push({
      student: userId,
      paymentId: paymentId || "",
      paymentMethod: paymentMethod || "upi",
      amountPaid: Number(amountPaid) || course.price,
    });
    await course.save();

    // earnings calculation
    const grossAmount = Number(amountPaid);
    const platformFee = Math.round(grossAmount * PLATFORM_CUT);

    await Earning.create({
      alumni: course.instructor,
      source: course._id,
      sourceModel: "Course",
      title: course.title,
      grossAmount, // ✅ FIX
      platformFee, // ✅ FIX
      student: userId,
      paymentMethod: paymentMethod || "upi",
      paymentId: paymentId || null,
      type: "course",
    });

    res.json({
      message: "Enrollment successful",
      courseId: course._id,
      grossAmount,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// APPROVE COURSE (ADMIN)
// ─────────────────────────────────────────────
export const approveCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("instructor", "name email");

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course approved", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};