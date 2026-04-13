import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import AlumniModelGate from "../../../components/common/AlumniModelGate";
import { useAuth } from "../../../context/AuthContext";

// IS_PREMIUM is now derived from real user data, not a hardcoded constant

const STATS = [
  { label: "Total Earnings", value: "₹45,000", icon: "💰", trend: "+12%", color: "var(--teal)" },
  { label: "This Month",     value: "₹8,500",  icon: "📈", trend: "+23%", color: "var(--purple-light)" },
  { label: "Sessions Taken", value: "32",       icon: "🎥", trend: "+3",   color: "var(--orange)" },
];

const TRANSACTIONS = [
  { id: 1, title: "System Design Session",      amount: 999,  date: "12 Apr 2026", students: 8,  type: "session"  },
  { id: 2, title: "React Workshop",             amount: 1499, date: "10 Apr 2026", students: 14, type: "workshop" },
  { id: 3, title: "FAANG Prep Course — Week 1", amount: 3200, date: "5 Apr 2026",  students: 28, type: "course"   },
  { id: 4, title: "1:1 Mentorship Call",        amount: 499,  date: "3 Apr 2026",  students: 1,  type: "mentorship" },
  { id: 5, title: "DSA Bootcamp Session",       amount: 1200, date: "28 Mar 2026", students: 11, type: "session"  },
];


const typeColors = {
  session: { bg: "rgba(124,92,252,0.1)", border: "rgba(124,92,252,0.25)", color: "var(--purple-light)", label: "Session" },
  workshop: { bg: "rgba(0,229,195,0.1)", border: "rgba(0,229,195,0.25)", color: "var(--teal)", label: "Workshop" },
  course: { bg: "rgba(255,112,67,0.1)", border: "rgba(255,112,67,0.25)", color: "var(--orange)", label: "Course" },
  mentorship: { bg: "rgba(245,200,66,0.1)", border: "rgba(245,200,66,0.25)", color: "#F5C842", label: "1:1" },
};

export default function Earnings() {
  const { user } = useAuth();
  const isPremium = user?.alumniPlan === "premium";
  const [tab, setTab] = useState("Earnings");

  return (
    <MainLayout>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 0" }}>
        <AlumniModelGate isPremium={isPremium} featureName="Earnings Dashboard">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>
              Earnings
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>
              Track your income and sessions
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 32,
        }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{
              background: "var(--bg-3)",
              border: "1px solid var(--border)",
              borderRadius: 16, padding: "18px 18px",
              transition: "border-color 0.2s",
              animation: "fadeUp 0.4s ease both",
              animationDelay: `${i * 70}ms`,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{stat.icon}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 99, color: "var(--teal)",
                  background: "rgba(0,229,195,0.1)",
                  border: "1px solid rgba(0,229,195,0.2)",
                }}>{stat.trend}</span>
              </div>
              <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: stat.color, marginBottom: 4 }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-3)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {["Earnings"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 18px", borderRadius: 99,
              background: tab === t ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" : "var(--bg-3)",
              border: `1px solid ${tab === t ? "transparent" : "var(--border)"}`,
              color: tab === t ? "white" : "var(--text-2)",
              fontSize: 13, fontWeight: tab === t ? 700 : 400,
              fontFamily: tab === t ? "Plus Jakarta Sans" : "DM Sans",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: tab === t ? "0 4px 14px rgba(124,92,252,0.3)" : "none",
            }}>{t}</button>
          ))}
        </div>

        {/* Earnings transactions */}
        {tab === "Earnings" && (
          <div style={{
            background: "var(--bg-3)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            overflow: "hidden",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                Recent Transactions
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                80% of total is yours · 20% platform fee
              </span>
            </div>

            {TRANSACTIONS.map((tx, i) => {
              const tc = typeColors[tx.type];
              const yourShare = Math.round(tx.amount * 0.8);
              return (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 20px",
                  borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: tc.bg, border: `1px solid ${tc.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: tc.color, fontSize: 16, flexShrink: 0,
                  }}>
                    {tx.type === "session" ? "🎥" : tx.type === "workshop" ? "🛠" : tx.type === "course" ? "📚" : "🎯"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 3 }}>{tx.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>📅 {tx.date}</span>
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>· 👥 {tx.students} students</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 99,
                        background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color,
                      }}>{tc.label}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--teal)" }}>
                      +₹{yourShare.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-3)" }}>of ₹{tx.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        </AlumniModelGate>
      </div>
    </MainLayout>
  );
}