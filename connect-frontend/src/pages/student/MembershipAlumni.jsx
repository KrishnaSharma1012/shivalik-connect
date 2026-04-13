import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";

const IconZap = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const IconPercent = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const IconStar = ({ size = 14, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.68, 0, 1.1] } },
};
const stagger = (delay = 0.07) => ({ hidden: {}, show: { transition: { staggerChildren: delay } } });

const alumniList = [
  { id: 1, name: "Aditya Kumar", role: "SDE-3", company: "Google", college: "IIT Delhi", batch: "'19", avatar: "AK", rating: 4.9, sessions: 142, subscribers: 31, tags: ["DSA", "System Design", "FAANG"], color: "var(--purple)", priceMonth: 199, subscribed: false },
  { id: 2, name: "Shreya Joshi", role: "Product Manager", company: "Microsoft", college: "BITS Pilani", batch: "'20", avatar: "SJ", rating: 5.0, sessions: 98, subscribers: 24, tags: ["PM Interview", "Product Strategy", "Case Study"], color: "#00E5C3", priceMonth: 199, subscribed: false },
  { id: 3, name: "Vikram Nair", role: "SDE-2", company: "Amazon", college: "NIT Trichy", batch: "'21", avatar: "VN", rating: 4.8, sessions: 76, subscribers: 18, tags: ["Backend", "AWS", "Java"], color: "var(--orange)", priceMonth: 199, subscribed: true },
  { id: 4, name: "Ishita Singh", role: "Data Scientist", company: "Flipkart", college: "DTU", batch: "'20", avatar: "IS", rating: 4.9, sessions: 115, subscribers: 27, tags: ["ML/AI", "Python", "Stats"], color: "var(--purple)", priceMonth: 199, subscribed: false },
  { id: 5, name: "Dev Khanna", role: "Backend Engineer", company: "Razorpay", college: "NSUT", batch: "'21", avatar: "DK", rating: 4.7, sessions: 61, subscribers: 12, tags: ["Go", "Microservices", "FinTech"], color: "#F5C842", priceMonth: 199, subscribed: false },
  { id: 6, name: "Meera Pillai", role: "ML Engineer", company: "Swiggy", college: "NIT Trichy", batch: "'19", avatar: "MP", rating: 4.9, sessions: 88, subscribers: 20, tags: ["Deep Learning", "PyTorch", "MLOps"], color: "#00E5C3", priceMonth: 199, subscribed: false },
  { id: 7, name: "Rohan Malhotra", role: "Frontend Engineer", company: "Adobe", college: "IIIT Hyderabad", batch: "'20", avatar: "RM", rating: 4.8, sessions: 73, subscribers: 16, tags: ["React", "Frontend", "JavaScript"], color: "var(--purple)", priceMonth: 199, subscribed: false },
  { id: 8, name: "Ananya Verma", role: "Software Engineer", company: "Uber", college: "IIT Bombay", batch: "'19", avatar: "AV", rating: 4.9, sessions: 102, subscribers: 23, tags: ["DSA", "System Design", "Backend"], color: "#F5C842", priceMonth: 199, subscribed: false },
  { id: 9, name: "Kunal Arora", role: "Data Analyst", company: "Zomato", college: "Delhi University", batch: "'22", avatar: "KA", rating: 4.6, sessions: 49, subscribers: 10, tags: ["SQL", "Python", "Analytics"], color: "#00E5C3", priceMonth: 199, subscribed: false },
  { id: 10, name: "Priya Menon", role: "SDE-2", company: "Atlassian", college: "VIT", batch: "'21", avatar: "PM", rating: 4.8, sessions: 67, subscribers: 14, tags: ["Java", "System Design", "Microservices"], color: "var(--orange)", priceMonth: 199, subscribed: false },
  { id: 11, name: "Harsh Gupta", role: "Cloud Engineer", company: "Oracle", college: "NIT Surathkal", batch: "'20", avatar: "HG", rating: 4.7, sessions: 58, subscribers: 11, tags: ["AWS", "DevOps", "Backend"], color: "var(--purple)", priceMonth: 199, subscribed: false },
  { id: 12, name: "Sneha Iyer", role: "Product Designer", company: "CRED", college: "Manipal", batch: "'22", avatar: "SI", rating: 4.9, sessions: 64, subscribers: 15, tags: ["Product Strategy", "Design", "Case Study"], color: "#00E5C3", priceMonth: 199, subscribed: false },
];

function SubscribeModal({ alumni, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--bg-2)", border: `1px solid ${alumni.color}30`, borderRadius: 22, padding: 36, maxWidth: 420, width: "100%" }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${alumni.color},${alumni.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>{alumni.avatar}</div>
          <div>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 17 }}>{alumni.name}</div>
            <div style={{ fontSize: 13, color: alumni.color, fontWeight: 600 }}>{alumni.role} @ {alumni.company}</div>
          </div>
        </div>

        <div style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>What you unlock</div>
          {[
            { icon: <IconZap size={14} />, text: "Fast-track replies — jump the queue", color: "#F5C842" },
            { icon: <IconPercent size={14} />, text: "Flat 15% off all courses, sessions & workshops", color: "#00E5C3" },
            { icon: <IconStar size={14} filled />, text: "Exclusive subscriber badge on your profile", color: "var(--purple-light)" },
          ].map((perk, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none", fontSize: 13, color: "var(--text-2)" }}>
              <span style={{ color: perk.color }}>{perk.icon}</span>{perk.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 14, color: "var(--text-2)" }}>Monthly subscription</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, color: "var(--text)" }}>₹199</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>per month · cancel anytime</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text-2)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}>
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            style={{ flex: 2, padding: "12px", background: `linear-gradient(135deg,${alumni.color},${alumni.color}cc)`, border: "none", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Plus Jakarta Sans", boxShadow: `0 8px 24px ${alumni.color}40` }}
          >
            Subscribe for ₹199/mo →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AlumniCard({ alumni, onSubscribe }) {
  const discountedBadge = alumni.subscribed;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      style={{ background: "var(--bg-2)", border: `1px solid ${alumni.subscribed ? alumni.color + "35" : "var(--border)"}`, borderRadius: 18, overflow: "hidden", position: "relative", transition: "border-color 0.2s" }}
    >
      {/* Subscribed glow top bar */}
      {alumni.subscribed && (
        <div style={{ height: 3, background: `linear-gradient(90deg,${alumni.color},${alumni.color}88,transparent)` }} />
      )}

      <div style={{ padding: "22px 22px 18px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg,${alumni.color},${alumni.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white" }}>{alumni.avatar}</div>
            {alumni.subscribed && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg,${alumni.color},#F5C842)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9, border: "2px solid var(--bg-2)" }}
              >
                ★
              </motion.div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{alumni.name}</div>
            <div style={{ fontSize: 12, color: alumni.color, fontWeight: 600 }}>{alumni.role} @ {alumni.company}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{alumni.college} {alumni.batch}</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {alumni.tags.map((tag, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: `${alumni.color}12`, border: `1px solid ${alumni.color}25`, color: alumni.color }}>{tag}</span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#F5C842", fontSize: 12 }}>★</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: "var(--text)" }}>{alumni.rating}</span>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-3)" }}>
            <IconUsers />{alumni.sessions} sessions
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-3)" }}>
            <span style={{ color: alumni.color }}>★</span>{alumni.subscribers} subscribers
          </div>
        </div>

        {/* Membership perks preview */}
        <div style={{ background: alumni.subscribed ? `${alumni.color}08` : "var(--bg-3)", border: `1px solid ${alumni.subscribed ? alumni.color + "25" : "var(--border)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: alumni.subscribed ? alumni.color : "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            {alumni.subscribed ? "Your Subscriber Perks ✓" : "Membership Perks"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: alumni.subscribed ? "var(--text)" : "var(--text-2)" }}>
              <span style={{ color: "#F5C842" }}><IconZap size={11} /></span>
              Fast-track replies from {alumni.name.split(" ")[0]}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: alumni.subscribed ? "var(--text)" : "var(--text-2)" }}>
              <span style={{ color: "#00E5C3" }}><IconPercent size={11} /></span>
              Flat 15% off all courses, sessions & workshops
            </div>
          </div>
        </div>

        {/* CTA */}
        {alumni.subscribed ? (
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "10px", background: `${alumni.color}15`, border: `1px solid ${alumni.color}30`, borderRadius: 10, textAlign: "center", fontSize: 12, fontWeight: 700, color: alumni.color }}>
              ✓ Subscribed · ₹199/mo
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ flex: 1, padding: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}
            >
              View Profile
            </motion.button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 6px 20px ${alumni.color}35` }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSubscribe(alumni)}
              style={{ flex: 2, padding: "10px", background: `linear-gradient(135deg,${alumni.color},${alumni.color}cc)`, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}
            >
              Subscribe ₹199/mo →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ flex: 1, padding: "10px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}
            >
              View
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MembershipAlumniPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [alumni, setAlumni] = useState(alumniList);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matchingProfiles = alumni.filter(a => {
    const query = search.toLowerCase();
    return search === "" || a.name.toLowerCase().includes(query) || a.company.toLowerCase().includes(query) || a.tags.some(t => t.toLowerCase().includes(query));
  });

  const searchSuggestions =
    search.trim() === ""
      ? []
      : alumni
          .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 6);

  const suggestedAlumni = alumni
    .map(a => {
      const query = search.trim().toLowerCase();
      const skillMatches = query === "" ? 0 : a.tags.filter(t => t.toLowerCase().includes(query)).length;
      const roleOrCompanyMatch = query !== "" && (a.role.toLowerCase().includes(query) || a.company.toLowerCase().includes(query));
      const activityScore = a.sessions * 2 + a.subscribers + Math.round(a.rating * 10);
      const relevanceScore = skillMatches * 50 + (roleOrCompanyMatch ? 30 : 0);
      const score = relevanceScore + activityScore;

      let reason = `High activity: ${a.sessions} sessions`;
      if (skillMatches > 0) reason = `Skill match: ${a.tags.find(t => t.toLowerCase().includes(query))}`;
      else if (roleOrCompanyMatch) reason = `Relevant role at ${a.company}`;

      return { ...a, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const openProfile = (alumnus) => {
    navigate("/alumni-profile", {
      state: {
        alumni: {
          ...alumnus,
          role: `${alumnus.role} @ ${alumnus.company}`,
        },
      },
    });
  };

  const handleSearchEnter = (e) => {
    if (e.key !== "Enter") return;
    if (matchingProfiles.length > 0) {
      openProfile(matchingProfiles[0]);
      setShowSuggestions(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: "clamp(22px,3.5vw,34px)", lineHeight: 1.2, marginBottom: 8 }}>
            Alumni with <span style={{ background: "linear-gradient(135deg,#F5C842,#FF7043)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Memberships</span>
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 520 }}>
            Subscribe to any alumnus for ₹199/month and unlock fast-track replies plus 15% off all their courses, sessions, and workshops.
          </p>
        </motion.div>

        {/* Perks banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { icon: <IconZap size={14} />, text: "Fast-track replies from your alumni", color: "#F5C842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.2)" },
            { icon: <IconPercent size={14} />, text: "Flat 15% off all their courses & sessions", color: "#00E5C3", bg: "rgba(0,229,195,0.08)", border: "rgba(0,229,195,0.2)" },
            { icon: <span style={{ fontSize: 12 }}>₹</span>, text: "Just ₹199 per month per alumni", color: "var(--purple-light)", bg: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.2)" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 100, background: item.bg, border: `1px solid ${item.border}`, fontSize: 12, fontWeight: 600, color: item.color }}>
              <span>{item.icon}</span>{item.text}
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}><IconSearch /></span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearchEnter}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                placeholder="Search alumni, company, skills..."
                style={{ width: "100%", padding: "10px 14px 10px 36px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "Plus Jakarta Sans", boxSizing: "border-box" }}
              />

              {showSuggestions && search.trim() !== "" && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", zIndex: 20, boxShadow: "0 10px 28px rgba(0,0,0,0.25)" }}>
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map(profile => (
                      <button
                        key={profile.id}
                        onMouseDown={e => {
                          e.preventDefault();
                          openProfile(profile);
                        }}
                        style={{ width: "100%", border: "none", borderBottom: "1px solid var(--border)", background: "transparent", color: "var(--text)", padding: "10px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "Plus Jakarta Sans" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${profile.color},${profile.color}88)`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {profile.avatar}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700 }}>{profile.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-3)" }}>{profile.role} @ {profile.company}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--text-3)" }}>
                      No matching profiles
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Suggested Alumni</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {suggestedAlumni.map(profile => (
              <button
                key={`suggested-${profile.id}`}
                onClick={() => openProfile(profile)}
                style={{
                  width: "100%",
                  background: "var(--bg-2)",
                  border: `1px solid ${profile.color}35`,
                  borderRadius: 12,
                  padding: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--text)",
                  fontFamily: "Plus Jakarta Sans",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${profile.color},${profile.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
                    {profile.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{profile.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{profile.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: profile.color, fontWeight: 600, marginBottom: 3 }}>{profile.reason}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)" }}>{profile.sessions} sessions · {profile.subscribers} subscribers</div>
              </button>
            ))}
          </div>
        </motion.div>

        {search.trim() !== "" && matchingProfiles.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "34px 20px", color: "var(--text-3)", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>🔍</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No alumni found</div>
            <div style={{ fontSize: 13 }}>Try another skill, company, or name</div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
