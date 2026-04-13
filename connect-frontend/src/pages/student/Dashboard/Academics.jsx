import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { CourseCard } from "../../../components/academics/CourseCard";
import { SessionCard } from "../../../components/academics/CourseCard";
import { getStudentCatalog } from "../../../utils/academicCatalog";

const TABS = ["All", "Courses", "Live Sessions", "Workshops"];

export default function Academics() {
  const [activeTab, setActiveTab] = useState("All");
  const { courses: COURSES, sessions: SESSIONS } = getStudentCatalog();

  const showCourses   = activeTab === "All" || activeTab === "Courses";
  const showSessions  = activeTab === "All" || activeTab === "Live Sessions" || activeTab === "Workshops";

  return (
    <MainLayout>
      <div style={{ padding: "24px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>
            Academics
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Courses, live sessions & workshops by verified alumni
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 18px", borderRadius: 99, flexShrink: 0,
              background: activeTab === tab ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" : "var(--bg-3)",
              border: `1px solid ${activeTab === tab ? "transparent" : "var(--border)"}`,
              color: activeTab === tab ? "white" : "var(--text-2)",
              fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
              fontFamily: activeTab === tab ? "Plus Jakarta Sans" : "DM Sans",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: activeTab === tab ? "0 4px 14px rgba(124,92,252,0.3)" : "none",
            }}>{tab}</button>
          ))}
        </div>

        {/* Courses */}
        {showCourses && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
                Courses
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{COURSES.length} available</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {COURSES.map((course, i) => (
                <div key={course.id} style={{ animation: "fadeUp 0.4s ease both", animationDelay: `${i * 80}ms` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions */}
        {showSessions && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
                Live Sessions & Workshops
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{SESSIONS.length} upcoming</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {SESSIONS.map((session, i) => (
                <div key={session.id} style={{ animation: "fadeUp 0.4s ease both", animationDelay: `${i * 80}ms` }}>
                  <SessionCard session={session} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}