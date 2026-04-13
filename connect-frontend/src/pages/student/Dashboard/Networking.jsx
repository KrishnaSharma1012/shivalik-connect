import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import AlumniCard from "../../../components/networking/AlumniCard";
import { useAuth } from "../../../context/AuthContext";

const ALL_ALUMNI = [
  { id: 1, name: "Rahul Sharma",   role: "Software Engineer @ Google",    college: "IIT Delhi",   verified: true, isPremium: true, has24h: true  },
  { id: 2, name: "Ananya Verma",   role: "Frontend Engineer @ Amazon",    college: "DTU",         verified: true, isPremium: false, has24h: false },
  { id: 3, name: "Aman Gupta",     role: "Data Scientist @ Microsoft",    college: "NIT Trichy",  verified: true, isPremium: true, has24h: true  },
  { id: 4, name: "Priya Nair",     role: "Product Manager @ Flipkart",    college: "IIT Bombay",  verified: true, isPremium: false, has24h: true  },
  { id: 5, name: "Siddharth Jain", role: "ML Engineer @ Meta",            college: "BITS Pilani", verified: true, isPremium: true, has24h: false },
  { id: 6, name: "Neha Singh",     role: "Backend Engineer @ Netflix",    college: "IIT Delhi",   verified: true, isPremium: false, has24h: false },
];

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function Networking() {
  const { user } = useAuth();
  const [search,  setSearch]  = useState("");
  const hasSearch = search.trim().length > 0;

  const normalize = (value = "") =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const splitKeywords = (value = "") =>
    normalize(value)
      .split(" ")
      .filter(word => word.length > 2);

  const interestKeywords = Array.isArray(user?.interests)
    ? user.interests.flatMap(item => splitKeywords(item))
    : splitKeywords(user?.interests || "");

  const skillKeywords = Array.isArray(user?.skills)
    ? user.skills.flatMap(item => splitKeywords(item))
    : splitKeywords(user?.skills || "");

  const activityKeywords = splitKeywords(
    `${user?.currentActivity || ""} ${user?.role || ""} ${user?.targetRole || ""}`
  );

  const studentKeywords = Array.from(new Set([
    ...interestKeywords,
    ...skillKeywords,
    ...activityKeywords,
  ]));

  const scoreAlumni = (alumni) => {
    if (!studentKeywords.length) return 0;
    const alumniText = normalize(`${alumni.role} ${alumni.college}`);
    return studentKeywords.reduce((score, keyword) => {
      if (alumniText.includes(keyword)) return score + 1;
      return score;
    }, 0);
  };

  const suggestedAlumni = [...ALL_ALUMNI].sort((a, b) => scoreAlumni(b) - scoreAlumni(a));

  const filtered = ALL_ALUMNI.filter(a => {
    const matchSearch  = a.name.toLowerCase().includes(search.toLowerCase()) ||
                         a.role.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>
            Discover Alumni
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Connect with verified alumni from top colleges and companies
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, company, or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 38px",
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text)", fontSize: 14,
              outline: "none", fontFamily: "DM Sans",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {!hasSearch && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>
              Suggestions
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-3)" }}>
              Recommended alumni based on your interests and current activity
            </p>
          </div>
        )}

        {hasSearch && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>
              Search Results
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-3)" }}>
              Matching alumni for "{search.trim()}"
            </p>
          </div>
        )}

        {/* Alumni list */}
        {hasSearch && filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "var(--bg-3)", border: "1px solid var(--border)",
            borderRadius: 18,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              No alumni found
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              Try a different name, company, or role keyword
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(hasSearch ? filtered : suggestedAlumni).map((alumni, i) => (
              <div key={alumni.id} style={{ animation: "fadeUp 0.35s ease both", animationDelay: `${i * 50}ms` }}>
                <AlumniCard alumni={alumni} />
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}