import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CrownIcon from "../../components/common/CrownIcon";
import PostCard from "../../components/feed/PostCard";
import PaymentModal from "../../components/academics/PaymentModal";
import { getPostsByAlumniName } from "../../utils/alumniData";

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const DUMMY_SESSIONS = [
  { id: 1, title: "System Design Deep Dive", date: "25 Apr 2026", price: 999, seats: 5 },
  { id: 2, title: "FAANG Interview Prep", date: "30 Apr 2026", price: 1499, seats: 12 },
];

export default function StudentAlumniProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const alumni = state?.alumni;
  const alumniPosts = Array.isArray(state?.posts) && state.posts.length > 0
    ? state.posts
    : getPostsByAlumniName(alumni?.name);
  const [connectStatus, setConnectStatus] = useState("connect");
  const [activeTab, setActiveTab] = useState("About");
  const [membershipTaken, setMembershipTaken] = useState(Boolean(alumni?.subscribed || alumni?.membershipTaken));
  const [showMembershipPayment, setShowMembershipPayment] = useState(false);

  const allowsMembership = Boolean(alumni?.membershipEnabled || alumni?.isPremium || alumni?.priceMonth);

  const TABS = ["About", "Posts", "Sessions", "Reviews"];

  const companies = {
    "Google": "#4285F4", "Amazon": "#FF9900", "Microsoft": "#00A4EF",
    "Meta": "#1877F2", "Netflix": "#E50914", "Flipkart": "#2874F0",
  };
  const companyName = alumni?.role?.split("@ ")[1] || "";
  const accentColor = companies[companyName] || "var(--purple)";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  if (!alumni) {
    return (
      <MainLayout>
        <div style={{ maxWidth: 720, margin: "60px auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: "var(--text)", marginBottom: 8 }}>
            Alumni not found
          </h2>
          <p style={{ color: "var(--text-3)", marginBottom: 24 }}>Navigate from the Networking page to view an alumni profile.</p>
          <button onClick={() => navigate("/networking")} style={{
            padding: "10px 24px", background: "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
            border: "none", borderRadius: 11, color: "white", fontWeight: 700,
            fontFamily: "Plus Jakarta Sans", cursor: "pointer",
          }}>Go to Networking →</button>
        </div>
      </MainLayout>
    );
  }

  const initial = (alumni.name || "A")[0].toUpperCase();

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0" }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "var(--text-3)",
          fontSize: 13, cursor: "pointer", marginBottom: 20,
          fontFamily: "DM Sans", transition: "color 0.2s", padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
        >
          <BackIcon /> Back
        </button>

        {/* Profile card */}
        <div style={{
          background: "var(--bg-3)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden", marginBottom: 20,
        }}>
          {/* Cover */}
          <div style={{
            height: 120,
            background: `linear-gradient(135deg, ${accentColor}18 0%, rgba(124,92,252,0.12) 50%, rgba(0,229,195,0.08) 100%)`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)",
              width: 280, height: 60,
              background: `radial-gradient(ellipse, ${accentColor}22 0%, transparent 70%)`,
              filter: "blur(20px)",
            }} />
          </div>

          <div style={{ padding: "0 28px 28px" }}>
            {/* Avatar + actions row */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -44, marginBottom: 20 }}>
              {/* Avatar with verified ring */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: 22,
                  background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}22)`,
                  border: `3px solid var(--bg-3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: accentColor, fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 34,
                  boxShadow: `0 6px 24px ${accentColor}30`,
                }}>
                  {initial}
                </div>
                {alumni.verified && (
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--teal)", border: "3px solid var(--bg-3)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#000",
                  }}>
                    <CheckIcon />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                {allowsMembership && (
                  <button
                    onClick={() => {
                      if (membershipTaken) return;
                      setShowMembershipPayment(true);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 11,
                      border: membershipTaken ? "1px solid rgba(16,185,129,0.3)" : "none",
                      background: membershipTaken ? "rgba(16,185,129,0.12)" : "linear-gradient(135deg, #F5C842, #FFB830)",
                      color: membershipTaken ? "#10B981" : "#1A1A1A",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "Plus Jakarta Sans",
                      cursor: membershipTaken ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {membershipTaken ? "Membership Active" : "Take Membership"}
                  </button>
                )}
                {connectStatus === "connected" && (
                  <button onClick={() => navigate("/messages")} style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 18px", borderRadius: 11,
                    background: "rgba(0,229,195,0.1)", border: "1px solid rgba(0,229,195,0.3)",
                    color: "var(--teal)", fontSize: 13, fontWeight: 700,
                    fontFamily: "Plus Jakarta Sans", cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <MessageIcon /> Message
                  </button>
                )}
                <button
                  onClick={() => { if (connectStatus === "connect") setConnectStatus("pending"); else if (connectStatus === "pending") setConnectStatus("connected"); }}
                  style={{
                    padding: "10px 22px", borderRadius: 11, border: "none",
                    fontSize: 13, fontWeight: 700, fontFamily: "Plus Jakarta Sans", cursor: "pointer",
                    transition: "all 0.2s",
                    background: connectStatus === "connect" ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)"
                      : connectStatus === "pending" ? "var(--bg-4)"
                      : "rgba(0,229,195,0.1)",
                    color: connectStatus === "connect" ? "white"
                      : connectStatus === "pending" ? "var(--text-3)"
                      : "var(--teal)",
                    border: connectStatus !== "connect" ? "1px solid var(--border)" : "none",
                    boxShadow: connectStatus === "connect" ? "0 4px 18px rgba(124,92,252,0.35)" : "none",
                  }}
                >
                  {connectStatus === "connect" ? "Connect" : connectStatus === "pending" ? "Pending…" : "✓ Connected"}
                </button>
              </div>
            </div>

            {/* Name + badges */}
            <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>
                {alumni.name}
              </h1>
              {alumni.verified && <span className="badge-verified">✓ Verified Alumni</span>}
              {alumni.isPremium && (
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  <CrownIcon size={16} />
                </span>
              )}
            </div>

            <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>{alumni.role}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>🎓 {alumni.college}</span>
              {alumni.has24h && <span className="badge-24h">⚡ Replies within 24h</span>}
              {allowsMembership && (
                <span style={{ fontSize: 12, fontWeight: 700, color: membershipTaken ? "#10B981" : "#F5C842", background: membershipTaken ? "rgba(16,185,129,0.12)" : "rgba(245,200,66,0.12)", border: membershipTaken ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,200,66,0.3)", borderRadius: 99, padding: "4px 10px" }}>
                  {membershipTaken ? "Membership subscribed" : "Membership available"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20,
        }}>
          {[
            { label: "Sessions", value: "45", color: "var(--purple-light)" },
            { label: "Students", value: "200+", color: "var(--teal)" },
            { label: "Courses", value: "6", color: "var(--orange)" },
            { label: "Rating", value: "4.8⭐", color: "#F5C842" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "16px 12px", textAlign: "center",
            }}>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, color: s.color, marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: 99,
              background: activeTab === tab ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" : "var(--bg-3)",
              border: `1px solid ${activeTab === tab ? "transparent" : "var(--border)"}`,
              color: activeTab === tab ? "white" : "var(--text-2)",
              fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
              fontFamily: "Plus Jakarta Sans", cursor: "pointer", transition: "all 0.2s",
              boxShadow: activeTab === tab ? "0 4px 14px rgba(124,92,252,0.3)" : "none",
            }}>{tab}</button>
          ))}
        </div>

        {/* About tab */}
        {activeTab === "About" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.3s ease" }}>
            <div style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "20px 22px",
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>About</h3>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.75 }}>
                Experienced professional helping students crack top companies with structured guidance, mock interviews, and real-world project advice. Passionate about mentoring the next generation of engineers.
              </p>
            </div>
            <div style={{
              background: "var(--bg-3)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "20px 22px",
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["DSA", "System Design", "React", "Interview Prep", "LLD", "HLD", "Python"].map((skill, i) => (
                  <span key={i} style={{
                    padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                    background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.22)",
                    color: "var(--purple-light)",
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts tab */}
        {activeTab === "Posts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.3s ease" }}>
            {alumniPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "44px 20px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 16 }}>
                <p style={{ fontSize: 34, marginBottom: 10 }}>📝</p>
                <p style={{ fontSize: 14, color: "var(--text-3)" }}>No posts available for this alumni yet.</p>
              </div>
            ) : (
              alumniPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {/* Sessions tab */}
        {activeTab === "Sessions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.3s ease" }}>
            {DUMMY_SESSIONS.map(s => (
              <div key={s.id} style={{
                background: "var(--bg-3)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "18px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              }}>
                <div>
                  <h4 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{s.title}</h4>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>📅 {s.date} · {s.seats} seats left</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>₹{s.price}</p>
                  <button style={{
                    padding: "7px 16px", background: "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
                    border: "none", borderRadius: 9, color: "white", fontSize: 12, fontWeight: 700,
                    fontFamily: "Plus Jakarta Sans", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(124,92,252,0.3)",
                  }}>Enroll →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "Reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.3s ease" }}>
            {[
              { name: "Priya M.", text: "Rahul's system design session was 🔥. Landed my Google offer 3 weeks later!", rating: 5 },
              { name: "Karan S.", text: "Very thorough and patient mentor. Cleared all my doubts in one session.", rating: 5 },
              { name: "Divya R.", text: "The FAANG prep course is worth every rupee. Highly recommended!", rating: 4 },
            ].map((r, i) => (
              <div key={i} style={{
                background: "var(--bg-3)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{r.name}</span>
                  <span style={{ color: "#F5C842", fontSize: 13 }}>{"⭐".repeat(r.rating)}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      <PaymentModal
        isOpen={showMembershipPayment}
        onClose={() => setShowMembershipPayment(false)}
        course={{
          title: `${alumni.name} Membership`,
          instructor: alumni.name,
          price: alumni?.priceMonth || 199,
        }}
        skipEnrollment
        onPaymentSuccess={() => {
          setMembershipTaken(true);
        }}
      />
    </MainLayout>
  );
}
