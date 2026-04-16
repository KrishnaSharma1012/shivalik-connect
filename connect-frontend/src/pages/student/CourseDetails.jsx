import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PaymentModal from "../../components/academics/PaymentModal";
import courseThumbnail from "../../assets/hero.png";
import API from "../../utils/api";
import Loader from "../../components/common/Loader";
import { isAcademicItemEnrolled } from "../../utils/academicCatalog";

const MODULES = [
  { num: "01", title: "Foundations & Problem Solving", lessons: 12 },
  { num: "02", title: "Advanced Data Structures",      lessons: 18 },
  { num: "03", title: "System Design (HLD + LLD)",     lessons: 14 },
  { num: "04", title: "Mock Interviews & Feedback",    lessons: 8  },
];

const OUTCOMES = [
  "Master Data Structures & Algorithms from scratch",
  "Crack system design interviews at top companies",
  "Real interview experiences and insider tips",
  "Resume review & placement strategy session",
  "Lifetime access to recordings and materials",
];



const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const StarIcon = ({ filled = true }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ViewProfileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3h7v7" />
    <path d="M10 14L21 3" />
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  </svg>
);

const getInstructorProfile = instructor => {
  const name = instructor?.name || "Instructor";
  const company = instructor?.company || instructor?.title || "Verified Mentor";

  return {
    _id: instructor?._id,
    name,
    role: company,
    verified: true,
    college: company,
    isPremium: true,
    has24h: false,
  };
};

import { useAuth } from "../../context/AuthContext";

export default function CourseDetail() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const [course, setCourse] = useState(state?.course);
  const enrolled = isAcademicItemEnrolled(course, user);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(!course?.syllabus);

  React.useEffect(() => {
    // If we have a course but no syllabus, fetch full details from DB
    if (course && !course.syllabus) {
      const fetchDetails = async () => {
        try {
          const courseId = course._id || course.id;
          if (typeof courseId !== "string" || courseId.length < 24) {
             setLoading(false); return;
          }
          const res = await API.get(`/courses/${courseId}`);
          if (res.data.course) {
             setCourse(res.data.course);
          }
        } catch (err) {
          console.error("Failed to fetch course details", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [course?._id || course?.id]);

  if (!course) {
    return (
      <MainLayout>
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-3)" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
          <p style={{ marginBottom: 20 }}>No course data found.</p>
          <button onClick={() => navigate("/academics")} style={{
            padding: "10px 22px", background: "var(--purple)", border: "none",
            borderRadius: 10, color: "white", cursor: "pointer", fontFamily: "Plus Jakarta Sans", fontWeight: 700,
          }}>Back to Academics</button>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: 120, textAlign: "center" }}>
          <Loader text="Fetching latest course content..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 0" }}>

        {/* Back */}
        <button onClick={() => navigate("/academics")} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 14px", borderRadius: 9,
          background: "transparent", border: "1px solid var(--border)",
          color: "var(--text-2)", fontSize: 13, cursor: "pointer",
          marginBottom: 20, transition: "all 0.2s", fontFamily: "DM Sans",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple-light)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
        ><BackIcon /> Back to Academics</button>

        {/* Hero card */}
        <div style={{
          background: "var(--bg-3)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden", marginBottom: 20,
        }}>
          <div style={{ height: 6, background: "linear-gradient(90deg, #7C5CFC, #FF7043, #00E5C3)" }} />
          <div style={{ padding: "28px 28px 24px" }}>
            <div style={{
              marginBottom: 18,
              borderRadius: 18,
              overflow: "hidden",
              background: "var(--bg-4)",
              border: "1px solid var(--border)",
            }}>
              <img
                src={course.thumbnail || courseThumbnail}
                alt={course.title}
                style={{ display: "block", width: "100%", aspectRatio: course.thumbnailRatio || "16 / 9", objectFit: course.thumbnailFit || "contain", background: "var(--bg-2)" }}
              />
            </div>

            <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 26, color: "var(--text)", lineHeight: 1.25, marginBottom: 10 }}>
              {course?.title || "Course Details"}
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 18 }}>
              {course?.description || "Loading description..."}
            </p>

            {/* Instructor row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "12px 14px", background: "var(--bg-4)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #7C5CFC, #FF7043)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 15,
              }}>{(course?.instructor?.name || course?.instructor || "I")[0]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{course?.instructor?.name || course?.instructor || "Verified Mentor"}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {course?.students && <span style={{ fontSize: 12, color: "var(--text-3)" }}>{course?.studentsCount || course?.students || 0} students</span>}
                </div>
              </div>
              <button
                onClick={() => navigate("/alumni-profile", { state: { alumniId: course?.instructor?._id || course?.instructor } })}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 14px", borderRadius: 11,
                  background: "transparent", border: "1px solid var(--border)",
                  color: "var(--text)", fontSize: 13, fontWeight: 700,
                  fontFamily: "Plus Jakarta Sans", cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(124,92,252,0.35)";
                  e.currentTarget.style.color = "var(--purple-light)";
                  e.currentTarget.style.background = "rgba(124,92,252,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <ViewProfileIcon />
                View Profile
              </button>
            </div>

            {/* Price & CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 30, color: "var(--text)" }}>₹{(course?.price || 0).toLocaleString()}</span>
              </div>
              <button onClick={() => enrolled ? null : setOpen(true)} style={{
                padding: "13px 28px",
                background: enrolled 
                  ? "rgba(0, 229, 195, 0.1)" 
                  : "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
                border: enrolled ? "1.5px solid rgba(0, 229, 195, 0.4)" : "none",
                borderRadius: 13,
                color: enrolled ? "var(--teal)" : "white", fontSize: 16, fontWeight: 700, fontFamily: "Plus Jakarta Sans",
                cursor: enrolled ? "default" : "pointer", 
                boxShadow: enrolled ? "none" : "0 6px 24px rgba(124,92,252,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!enrolled) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={e => { if (!enrolled) e.currentTarget.style.opacity = "1"; }}
              >{enrolled ? "✓ Enrolled" : "Enroll Now →"}</button>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 16 }}>What you'll learn</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "var(--teal)", flexShrink: 0, marginTop: 2 }}><CheckIcon /></span>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>{o}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course content */}
        <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Course Content</h2>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
              {course.syllabus?.length || MODULES.reduce((a, m) => a + m.lessons, 0)} {course.syllabus ? "modules" : "lessons"} · Lifetime access
            </p>
          </div>
          {(course.syllabus?.length > 0 ? course.syllabus : MODULES).map((mod, i) => (
            <div key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                padding: "14px 24px", borderBottom: i < ((course.syllabus?.length || MODULES.length) - 1) ? "1px solid var(--border)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", transition: "background 0.15s",
                background: expanded === i ? "rgba(124,92,252,0.05)" : "transparent",
              }}
              onMouseEnter={e => { if (expanded !== i) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { if (expanded !== i) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 13, color: "var(--purple-light)", width: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{mod.topic || mod.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{mod.video ? mod.video.duration : (mod.lessons ? `${mod.lessons} lessons` : "Live")}</span>
                <span style={{ fontSize: 14, color: "var(--text-3)", transform: expanded === i ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {enrolled && course.syllabus?.some(row => row.video) && (
          <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 16 }}>Topic Videos</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {course.syllabus.filter(row => row.video).map((row, index) => (
                <div key={`${row.week}-${index}`} style={{ padding: 14, borderRadius: 14, background: "var(--bg-4)", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 12, color: "var(--purple-light)", fontWeight: 700, marginBottom: 4 }}>{row.week}</p>
                  <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 10 }}>{row.topic}</p>
                  {row.video.url && (row.video.url.includes("youtube.com") || row.video.url.includes("youtu.be")) ? (
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12, background: "var(--bg-2)" }}>
                      <iframe 
                        src={row.video.url.includes("youtube.com/embed") ? row.video.url : row.video.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        title={row.topic}
                      />
                    </div>
                  ) : (
                    <video src={row.video.url} controls style={{ width: "100%", display: "block", borderRadius: 12 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {enrolled && course.assignments?.length > 0 && (
          <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 16 }}>Course Assignments</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {course.assignments.map((asm, idx) => (
                <div key={idx} style={{ 
                  padding: 16, borderRadius: 16, background: "var(--bg-4)", border: "1px solid var(--border)",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>📝 {asm.title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>{asm.description}</p>
                    <div style={{ display: "flex", gap: 12 }}>
                       <span style={{ fontSize: 11, color: "var(--text-3)" }}>📅 Due: {asm.dueDate ? new Date(asm.dueDate).toLocaleDateString() : "TBD"}</span>
                       <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700 }}>Points: {asm.marks || 100}</span>
                    </div>
                  </div>
                  <button style={{
                    padding: "8px 16px", background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.3)",
                    borderRadius: 10, color: "var(--purple-light)", fontSize: 12, fontWeight: 700, cursor: "pointer"
                  }} onMouseEnter={e => e.currentTarget.style.background = "rgba(124,92,252,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(124,92,252,0.1)"}>Submit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!enrolled && course.syllabus?.some(row => row.video) && (
          <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, padding: "22px 24px", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 10 }}>Topic Videos</h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
              Enroll in this course to unlock the full topic videos.
            </p>
          </div>
        )}

        {/* Instructor section */}
        <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18, padding: "22px 24px" }}>
          <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 16 }}>About the Instructor</h2>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 15, flexShrink: 0,
              background: "linear-gradient(135deg, #7C5CFC, #FF7043)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22,
            }}>{(course.instructor || "I")[0]}</div>
            <div>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>{course.instructor?.name || course.instructor}</p>
              <button
                onClick={() => navigate("/alumni-profile", { state: { alumniId: course.instructor?._id || course.instructor } })}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 14px", borderRadius: 11,
                  background: "transparent", border: "1px solid var(--border)",
                  color: "var(--text)", fontSize: 13, fontWeight: 700,
                  fontFamily: "Plus Jakarta Sans", cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: 10,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(124,92,252,0.35)";
                  e.currentTarget.style.color = "var(--purple-light)";
                  e.currentTarget.style.background = "rgba(124,92,252,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <ViewProfileIcon />
                View Profile
              </button>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
                Experienced engineer helping students break into top tech companies. Passionate about structured mentorship, real-world problem solving, and helping the next generation of engineers succeed.
              </p>
            </div>
          </div>
        </div>

      </div>

      <PaymentModal isOpen={open} onClose={() => setOpen(false)} course={course} />
    </MainLayout>
  );
}