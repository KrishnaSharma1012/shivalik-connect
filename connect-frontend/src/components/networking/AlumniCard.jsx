import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const companies = {
  "Google": "#4285F4", "Amazon": "#FF9900", "Microsoft": "#00A4EF",
  "Meta": "#1877F2", "Netflix": "#E50914", "Flipkart": "#2874F0",
};

export default function AlumniCard({ alumni }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("connect");

  const handleConnect = (e) => {
    e.stopPropagation();
    if (status === "connect") setStatus("pending");
    else if (status === "pending") setStatus("connected");
  };

  const companyName = alumni.role?.split("@ ")[1] || "";
  const companyColor = companies[companyName] || "var(--purple)";

  return (
    <div
      onClick={() => navigate("/alumni-profile", { state: { alumni } })}
      style={{
        background: "var(--bg-3)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "16px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `linear-gradient(135deg, ${companyColor}44, ${companyColor}22)`,
          border: `1px solid ${companyColor}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: companyColor, fontSize: 18, fontWeight: 800, fontFamily: "Plus Jakarta Sans",
        }}>
          {(alumni.name || "A")[0].toUpperCase()}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 3 }}>
          <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
            {alumni.name}
          </span>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 5 }}>
          {alumni.role}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-3)" }}>🎓 {alumni.college}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 7, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        {status === "connected" && (
          <button
            onClick={() => navigate("/messages")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px", borderRadius: 9,
              background: "rgba(0,229,195,0.1)",
              border: "1px solid rgba(0,229,195,0.25)",
              color: "var(--teal)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <MessageIcon /> Message
          </button>
        )}

        <button
          onClick={handleConnect}
          style={{
            padding: "7px 14px", borderRadius: 9,
            border: "none", fontSize: 12, fontWeight: 700,
            fontFamily: "Plus Jakarta Sans", cursor: "pointer",
            transition: "all 0.2s",
            background:
              status === "connect"   ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)" :
              status === "pending"   ? "var(--bg-4)" :
              "rgba(0,229,195,0.1)",
            color:
              status === "connect"   ? "white" :
              status === "pending"   ? "var(--text-3)" :
              "var(--teal)",
            border:
              status === "pending"   ? "1px solid var(--border)" :
              status === "connected" ? "1px solid rgba(0,229,195,0.25)" :
              "none",
            boxShadow:
              status === "connect" ? "0 4px 14px rgba(124,92,252,0.3)" : "none",
          }}
        >
          {status === "connect"   ? "Connect"   :
           status === "pending"   ? "Pending…"  :
           "✓ Connected"}
        </button>
      </div>
    </div>
  );
}