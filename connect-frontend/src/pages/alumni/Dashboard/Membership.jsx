import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../utils/api";

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconRupee = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const IconPercent = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const IconTrendUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.68, 0, 1.1] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function StatCard({ icon, value, label, sub, color }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      style={{
        background: "var(--bg-3)", border: `1px solid ${color}30`,
        borderRadius: 16, padding: "22px 20px", flex: 1, minWidth: 160,
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 26, color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-3)" }}>{sub}</div>}
    </motion.div>
  );
}

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 22, padding: 36, maxWidth: 440, width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 48, marginBottom: 12 }}
          >🎉</motion.div>
          <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Start Your Membership?</h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
            Students will pay <strong style={{ color: "var(--text)" }}>₹199/month</strong> to subscribe to you.<br />
            You'll earn <strong style={{ color: "#00E5C3" }}>₹139.30</strong> per subscriber (70%).<br />
            Membership renews monthly and you can pause anytime.
          </p>
        </div>

        <div style={{ background: "rgba(0,229,195,0.06)", border: "1px solid rgba(0,229,195,0.2)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#00E5C3", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>What your subscribers get</div>
          {[
            "Priority replies from you (fast-track queue)",
            "Flat 15% off all your courses, sessions & workshops",
            "Exclusive subscriber-only content",
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-2)", padding: "5px 0" }}>
              <span style={{ color: "#00E5C3", flexShrink: 0 }}><IconCheck /></span>{b}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text-2)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}>
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg,#00E5C3,#0A8FE8)", border: "none", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Plus Jakarta Sans" }}
          >
            Activate Membership →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AlumniMembershipPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPremium = user?.alumniPlan === "premium";

  // Hooks must always be called before any conditional returns
  const [membershipActive, setMembershipActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [membershipData, setMembershipData] = useState({
    startDate: "-",
    renewDate: "-",
    daysLeft: 0,
    subscribers: 0,
    totalEarned: "₹0",
    thisMonth: "₹0",
    recentSubscribers: [],
    revenueHistory: [],
    grossRevenue: 0,
    platformFee: 0,
    netEarnings: 0,
    pendingPayout: 0,
  });

  useEffect(() => {
    const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

    const fetchMembershipData = async () => {
      try {
        const [statsRes, conversationsRes] = await Promise.all([
          API.get("/earnings/stats"),
          API.get("/messages/conversations"),
        ]);

        const stats = statsRes.data || {};
        const conversations = conversationsRes.data?.conversations || [];
        const studentConversations = conversations.filter(
          (c) => c.partner?.role === "student" && c.partner?._id
        );

        const uniqueStudentsMap = new Map();
        studentConversations.forEach((c) => {
          if (!uniqueStudentsMap.has(c.partner._id)) {
            uniqueStudentsMap.set(c.partner._id, c);
          }
        });

        const recentSubscribers = Array.from(uniqueStudentsMap.values())
          .slice(0, 5)
          .map((c) => ({
            name: c.partner?.name || "Student",
            college: c.partner?.college || "-",
            date: c.lastTime
              ? new Date(c.lastTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "-",
            avatar: (c.partner?.name || "S")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
          }));

        const now = new Date();
        const renewDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysLeft = Math.max(0, Math.ceil((renewDateObj - now) / msPerDay));
        const monthLabel = now.toLocaleDateString("en-IN", { month: "short" });
        const thisMonthAmount = Number(stats.thisMonth || 0);

        setMembershipData({
          startDate: user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "-",
          renewDate: renewDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          daysLeft,
          subscribers: uniqueStudentsMap.size,
          totalEarned: formatMoney(stats.netEarnings || 0),
          thisMonth: formatMoney(thisMonthAmount),
          recentSubscribers,
          revenueHistory: thisMonthAmount > 0 ? [{ month: monthLabel, amount: Math.round(thisMonthAmount) }] : [],
          grossRevenue: Number(stats.totalGross || 0),
          platformFee: Number(stats.platformFee || 0),
          netEarnings: Number(stats.netEarnings || 0),
          pendingPayout: thisMonthAmount,
        });
      } catch (err) {
        console.error("Membership fetch error", err);
      }
    };

    if (isPremium && membershipActive) {
      fetchMembershipData();
    }
  }, [isPremium, membershipActive, user?.createdAt]);

  if (!isPremium) {
    return (
      <MainLayout>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }}>
          <div style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: "26px 22px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🔒</div>
            <h2 style={{ margin: 0, marginBottom: 8, fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: "var(--text)" }}>
              Membership is a Premium Feature
            </h2>
            <p style={{ margin: 0, marginBottom: 18, fontSize: 13, color: "var(--text-3)", lineHeight: 1.7 }}>
              Upgrade to Premium to access the Membership dashboard and start subscription-based earnings.
            </p>
            <button
              onClick={() => navigate("/alumni/dashboard/sessions")}
              style={{
                padding: "10px 18px",
                background: "linear-gradient(135deg, #FF7043, #FF9A6C)",
                border: "none",
                borderRadius: 11,
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans",
                cursor: "pointer",
              }}
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasSubscribers = membershipData.subscribers > 0;
  const canPauseMembership = !hasSubscribers;

  const handleActivate = () => {
    setShowConfirm(false);
    setMembershipActive(true);
  };

  const perks = [
    { icon: <IconZap />, title: "Fast-Track Replies", desc: "Subscribers jump to the top of your message queue. Reply faster, earn loyalty.", color: "#F5C842" },
    { icon: <IconPercent />, title: "15% Discount", desc: "Subscribers get flat 15% off all your courses, sessions & workshops automatically.", color: "#00E5C3" },
    { icon: <IconTrendUp />, title: "Monthly Income", desc: "₹139.30 per subscriber per month lands in your wallet on renewal.", color: "var(--purple-light)" },
    { icon: <IconShield />, title: "You Keep 70%", desc: "Platform takes only 30% to keep the lights on. Fair, transparent, always.", color: "var(--orange)" },
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }}>

        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 100, background: "rgba(0,229,195,0.1)", border: "1px solid rgba(0,229,195,0.25)", marginBottom: 12 }}>
                  <motion.span animate={{ scale: [1,1.4,1], opacity: [1,0.4,1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5C3" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#00E5C3", letterSpacing: "0.1em", textTransform: "uppercase" }}>Alumni Membership</span>
                </div>
                <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: "clamp(22px,3.5vw,34px)", lineHeight: 1.15, marginBottom: 8 }}>
                  Your Membership<br /><span style={{ background: "linear-gradient(135deg,#00E5C3,#0A8FE8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</span>
                </h1>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 480 }}>
                  Let students subscribe to you monthly. They get faster replies and special discounts while you earn a strong recurring share.
                </p>
              </div>

              {/* Status badge + pause action */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: membershipActive ? "rgba(0,229,195,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${membershipActive ? "rgba(0,229,195,0.3)" : "var(--border)"}` }}>
                  <motion.span animate={membershipActive ? { scale: [1,1.5,1], opacity: [1,0.3,1] } : {}} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: membershipActive ? "#00E5C3" : "var(--text-3)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: membershipActive ? "#00E5C3" : "var(--text-3)" }}>
                    {membershipActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {membershipActive && (
                  <>
                    <motion.button
                      whileHover={canPauseMembership ? { scale: 1.03 } : {}}
                      whileTap={canPauseMembership ? { scale: 0.97 } : {}}
                      disabled={!canPauseMembership}
                      onClick={() => {
                        if (!canPauseMembership) return;
                        setMembershipActive(false);
                      }}
                      style={{
                        padding: "9px 16px",
                        background: canPauseMembership ? "rgba(255,80,80,0.08)" : "rgba(255,255,255,0.04)",
                        border: canPauseMembership ? "1px solid rgba(255,80,80,0.2)" : "1px solid var(--border)",
                        borderRadius: 10,
                        color: canPauseMembership ? "#FF5050" : "var(--text-3)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: canPauseMembership ? "pointer" : "not-allowed",
                        fontFamily: "Plus Jakarta Sans",
                      }}
                    >
                      Pause Membership
                    </motion.button>
                    {!canPauseMembership && (
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-3)", maxWidth: 240, textAlign: "right" }}>
                        Cannot pause while you have active subscribers.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* ─── NOT ACTIVE STATE ─── */}
          {!membershipActive && (
            <motion.div variants={fadeUp}>
              {/* Perks grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 28 }}>
                {perks.map((p, i) => (
                  <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} style={{ background: "var(--bg-3)", border: `1px solid ${p.color}20`, borderRadius: 16, padding: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: p.color, marginBottom: 12 }}>{p.icon}</div>
                    <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.title}</div>
                    <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>{p.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Revenue calculator */}
              <motion.div variants={fadeUp} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 18, padding: 28, marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-3)", textTransform: "uppercase", marginBottom: 16 }}>Revenue Calculator</div>
                <div style={{ display: "flex", gap: 0, overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
                  {[5, 10, 20, 50, 100].map((n, i) => (
                    <div key={n} style={{ flex: 1, padding: "16px 12px", textAlign: "center", background: i % 2 === 0 ? "var(--bg-3)" : "var(--bg-4)", borderRight: i < 4 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{n} students</div>
                      <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 18, color: "#00E5C3" }}>₹{(n * 139.3).toFixed(0)}</div>
                      <div style={{ fontSize: 10, color: "var(--text-3)" }}>/ month</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 12 }}>* Based on ₹139.30 per subscriber (70% of ₹199)</p>
              </motion.div>

              {/* Activate CTA */}
              <motion.div variants={fadeUp} style={{ background: "linear-gradient(135deg,rgba(0,229,195,0.08),rgba(10,143,232,0.06))", border: "1px solid rgba(0,229,195,0.2)", borderRadius: 18, padding: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Ready to Start Earning?</h3>
                  <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
                    Activate your membership in one click. Students can subscribe immediately and you'll start earning from day one.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setShowConfirm(true)}
                  style={{ padding: "14px 32px", background: "linear-gradient(135deg,#00E5C3,#0A8FE8)", border: "none", borderRadius: 13, color: "white", fontSize: 15, fontWeight: 700, fontFamily: "Plus Jakarta Sans", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 8px 30px rgba(0,229,195,0.3)" }}
                >
                  Activate Membership →
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ─── ACTIVE STATE ─── */}
          {membershipActive && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Tab navigation */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: 4, background: "var(--bg-3)", borderRadius: 12, border: "1px solid var(--border)", width: "fit-content" }}>
                {["overview", "subscribers", "revenue"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Plus Jakarta Sans", background: activeTab === tab ? "linear-gradient(135deg,#00E5C3,#0A8FE8)" : "transparent", color: activeTab === tab ? "white" : "var(--text-3)", transition: "all 0.2s", textTransform: "capitalize", boxShadow: activeTab === tab ? "0 4px 14px rgba(0,229,195,0.3)" : "none" }}>
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div key="overview" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.3 }}>
                    {/* Stats row */}
                    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
                      <StatCard icon={<IconUsers />} value={membershipData.subscribers} label="Active Subscribers" sub="paying monthly" color="#00E5C3" />
                      <StatCard icon={<IconRupee />} value={membershipData.thisMonth} label="This Month" sub="from enrolled students" color="var(--purple-light)" />
                      <StatCard icon={<IconTrendUp />} value={membershipData.totalEarned} label="Total Earned" sub="since activation" color="var(--orange)" />
                      <StatCard icon={<IconClock />} value={`${membershipData.daysLeft}d`} label="Next Renewal" sub={membershipData.renewDate} color="#F5C842" />
                    </motion.div>

                    {/* Membership info card */}
                    <motion.div variants={fadeUp} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, marginBottom: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Membership Details</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
                        {[
                          { label: "Student Price", value: "₹199 / month", color: "#00E5C3" },
                          { label: "Your Cut (70%)", value: "₹139.30 / subscriber", color: "var(--purple-light)" },
                          { label: "Platform Cut (30%)", value: "₹59.70 / subscriber", color: "var(--text-3)" },
                          { label: "Duration", value: "1 month rolling", color: "var(--orange)" },
                          { label: "Activated On", value: membershipData.startDate, color: "var(--text-2)" },
                          { label: "Next Renewal", value: membershipData.renewDate, color: "#F5C842" },
                        ].map((item, i) => (
                          <div key={i} style={{ padding: "14px 16px", background: "var(--bg-3)", borderRadius: 12, border: "1px solid var(--border)" }}>
                            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: item.color }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Subscriber perks reminder */}
                    <motion.div variants={fadeUp} style={{ background: "rgba(0,229,195,0.05)", border: "1px solid rgba(0,229,195,0.2)", borderRadius: 16, padding: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#00E5C3", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>What Your Subscribers Enjoy</div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {[
                          { icon: <IconZap />, text: "Priority fast replies from you", color: "#F5C842" },
                          { icon: <IconPercent />, text: "Flat 15% off all your offerings", color: "#00E5C3" },
                          { icon: <IconStar />, text: "Exclusive subscriber status badge", color: "var(--purple-light)" },
                        ].map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
                            <span style={{ color: item.color }}>{item.icon}</span>{item.text}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === "subscribers" && (
                  <motion.div key="subscribers" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.3 }}>
                    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden" }}>
                      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15 }}>Active Subscribers</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#00E5C3", padding: "4px 12px", background: "rgba(0,229,195,0.1)", borderRadius: 100 }}>{membershipData.subscribers} total</span>
                      </div>
                      {membershipData.recentSubscribers.map((sub, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: i < membershipData.recentSubscribers.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,229,195,0.3),rgba(10,143,232,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#00E5C3", flexShrink: 0 }}>{sub.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{sub.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{sub.college}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "var(--text-3)" }}>Subscribed</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{sub.date}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "rgba(0,229,195,0.1)", color: "#00E5C3", border: "1px solid rgba(0,229,195,0.2)" }}>Active</span>
                          </div>
                        </motion.div>
                      ))}
                      {membershipData.recentSubscribers.length === 0 ? (
                        <div style={{ padding: "20px 24px", background: "var(--bg-3)", display: "flex", justifyContent: "center" }}>
                          <span style={{ fontSize: 13, color: "var(--text-3)" }}>No active subscribers yet.</span>
                        </div>
                      ) : (
                        <div style={{ padding: "14px 24px", background: "var(--bg-3)", display: "flex", justifyContent: "center" }}>
                          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                            + {Math.max(0, membershipData.subscribers - membershipData.recentSubscribers.length)} more subscribers
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "revenue" && (
                  <motion.div key="revenue" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} transition={{ duration: 0.3 }}>
                    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>Monthly Revenue (₹)</div>
                      {membershipData.revenueHistory.length === 0 ? (
                        <p style={{ fontSize: 13, color: "var(--text-3)" }}>No monthly revenue history available yet.</p>
                      ) : (
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 140 }}>
                          {membershipData.revenueHistory.map((item, i) => {
                            const maxVal = Math.max(...membershipData.revenueHistory.map(r => r.amount));
                            const heightPct = maxVal > 0 ? (item.amount / maxVal) * 100 : 0;
                            return (
                              <motion.div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: i === membershipData.revenueHistory.length - 1 ? "#00E5C3" : "var(--text-3)" }}>₹{item.amount}</div>
                                <motion.div
                                  initial={{ height: 0 }} animate={{ height: `${heightPct}%` }} transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 0.68, 0, 1.1] }}
                                  style={{ width: "100%", borderRadius: "8px 8px 0 0", background: i === membershipData.revenueHistory.length - 1 ? "linear-gradient(180deg,#00E5C3,#0A8FE8)" : "rgba(255,255,255,0.1)" }}
                                />
                                <div style={{ fontSize: 12, color: "var(--text-3)" }}>{item.month}</div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 18, padding: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Revenue Breakdown</div>
                      {[
                        { label: "Gross subscription revenue", value: `₹${membershipData.grossRevenue.toLocaleString("en-IN")}`, color: "var(--text)" },
                        { label: "Platform fee", value: `− ₹${membershipData.platformFee.toLocaleString("en-IN")}`, color: "var(--orange)" },
                        { label: "Your net earnings", value: `₹${membershipData.netEarnings.toLocaleString("en-IN")}`, color: "#00E5C3" },
                        { label: "Pending payout (this month)", value: `₹${membershipData.pendingPayout.toLocaleString("en-IN")}`, color: "var(--purple-light)" },
                      ].map((row, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                          <span style={{ fontSize: 14, color: "var(--text-2)" }}>{row.label}</span>
                          <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, color: row.color }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Membership status */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 24, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>Membership Status</div>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>Your membership auto-renews on {membershipData.renewDate}. Students can subscribe anytime.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && <ConfirmModal onConfirm={handleActivate} onCancel={() => setShowConfirm(false)} />}
      </AnimatePresence>
    </MainLayout>
  );
}
