import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PaymentModal from "../academics/PaymentModal";
import CrownIcon from "./CrownIcon";

// ── Layout constants — adjust to match your MainLayout ───────────────────────
const SIDEBAR_WIDTH = 240;
const NAVBAR_HEIGHT = 64;
// ─────────────────────────────────────────────────────────────────────────────

export default function AlumniModelGate({ isPremium, children, featureName = "this feature" }) {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    // Lock scroll on every possible scrolling ancestor
    const targets = [
      document.documentElement,   // <html>
      document.body,              // <body>
      document.querySelector("main"),
      document.querySelector("[data-content]"),
      document.querySelector(".main-content"),
      document.querySelector(".content-area"),
    ].filter(Boolean);

    const prevValues = targets.map(el => ({
      el,
      overflow: el.style.overflow,
      overflowY: el.style.overflowY,
    }));

    targets.forEach(el => {
      el.style.overflow = "hidden";
      el.style.overflowY = "hidden";
    });

    return () => {
      prevValues.forEach(({ el, overflow, overflowY }) => {
        el.style.overflow = overflow;
        el.style.overflowY = overflowY;
      });
    };
  }, [isPremium]);

  if (isPremium) return children;

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);

    if (user?.role === "alumni") {
      updateUser({ alumniPlan: "premium" });
    } else {
      navigate("/signup", { state: { role: "alumni", plan: "premium" } });
    }
  };

  return (
    <>
      {/* Blurred page content — non-interactive */}
      <div style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.4 }}>
        {children}
      </div>

      {/* Fixed overlay — covers only content area, sidebar + navbar stay accessible */}
      <div
        style={{
          position: "fixed",
          top: NAVBAR_HEIGHT,
          left: SIDEBAR_WIDTH,
          right: 0,
          bottom: 0,
          zIndex: 90,
          background: "rgba(8,9,14,0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            padding: "36px 32px",
            background: "var(--bg-2)",
            border: "1px solid rgba(255,112,67,0.3)",
            borderRadius: 22,
            maxWidth: 360,
            width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
            animation: "fadeUp 0.25s ease",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #FF7043, #FF9A6C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(255,112,67,0.4)",
            }}
          >
            <CrownIcon size={26} strokeWidth={2.2} style={{ color: "white" }} />
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 800,
                fontSize: 18,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              Premium Feature
            </p>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-2)",
                lineHeight: 1.7,
                maxWidth: 272,
                margin: "0 auto",
              }}
            >
              Upgrade to Premium to unlock {featureName} — upload Courses, Live
              Sessions, Workshops &amp; Earn.
            </p>
          </div>

          <button
            style={{
              marginTop: 4,
              padding: "11px 28px",
              background: "linear-gradient(135deg, #FF7043, #FF9A6C)",
              border: "none",
              borderRadius: 12,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "Plus Jakarta Sans",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(255,112,67,0.4)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            onClick={handleUpgrade}
          >
            Upgrade to Premium →
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={{
          title: "Alumni Premium Plan",
          instructor: "Connect",
          price: 999,
        }}
        skipEnrollment
        onPaymentSuccess={handlePaymentConfirm}
      />
    </>
  );
}