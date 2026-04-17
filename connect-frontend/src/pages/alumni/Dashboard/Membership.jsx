import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import Loader from "../../../components/common/Loader";
import PaymentModal from "../../../components/academics/PaymentModal";
import API from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

export default function AlumniMembershipPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [openPayment, setOpenPayment] = useState(false);
  const [activating, setActivating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  const isActive = Boolean(user?.alumniMembershipActive);

  const fetchConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/messages/conversations");
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error("Failed to load membership conversations", err);
      setConversations([]);
      setError(err?.response?.data?.message || "Failed to load membership data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const subscriberConversations = useMemo(
    () => conversations.filter((c) => Boolean(c.partner?.membershipTaken || c.partner?.subscribed)),
    [conversations]
  );

  const uniqueSubscribers = useMemo(() => {
    const map = new Map();
    subscriberConversations.forEach((c) => {
      const p = c.partner;
      if (p?._id && !map.has(String(p._id))) {
        map.set(String(p._id), p);
      }
    });
    return Array.from(map.values());
  }, [subscriberConversations]);

  const onActivateSuccess = async () => {
    if (activating) return;
    setActivating(true);
    try {
      const res = await API.post("/users/membership/activate");
      const updated = res?.data?.user;
      if (updated) {
        await updateUser(updated);
      } else {
        await updateUser({ alumniMembershipActive: true, alumniPlan: "premium" });
      }
    } catch (err) {
      console.error("Membership activation failed", err);
      alert(err?.response?.data?.message || "Failed to activate membership.");
    } finally {
      setActivating(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "26px 0" }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 26, color: "var(--text)", marginBottom: 6 }}>
            Membership Dashboard
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Offer your membership at ₹199/month. Students with active membership will appear below.
          </p>
        </div>

        <div style={{
          borderRadius: 16,
          border: `1px solid ${isActive ? "rgba(0,229,195,0.3)" : "var(--border)"}`,
          background: "var(--bg-3)",
          padding: "16px 14px",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Membership Status
            </p>
            <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 18, color: isActive ? "#00E5C3" : "var(--text)" }}>
              {isActive ? "Active" : "Inactive"}
            </p>
          </div>

          {!isActive && (
            <button
              onClick={() => setOpenPayment(true)}
              style={{
                padding: "10px 16px",
                borderRadius: 11,
                border: "none",
                background: "linear-gradient(135deg, #00E5C3, #0A8FE8)",
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans",
                cursor: "pointer",
              }}
            >
              Activate at ₹199/mo
            </button>
          )}
        </div>

        <div style={{
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--bg-3)",
          padding: "16px 14px",
          marginBottom: 14,
        }}>
          <p style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 6 }}>
            Monthly Membership Price
          </p>
          <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 2 }}>
            ₹199
          </p>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>Students pay per month to subscribe to you.</p>
        </div>

        {loading && <Loader text="Loading membership data..." />}

        {!loading && error && (
          <div style={{
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,75,110,0.25)",
            background: "rgba(255,75,110,0.08)",
            color: "#ff9cb0",
            fontSize: 12,
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {!loading && (
          <div>
            <h3 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>
              Active Subscribers ({uniqueSubscribers.length})
            </h3>

            {uniqueSubscribers.length === 0 ? (
              <div style={{
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--bg-3)",
                padding: "20px 16px",
                color: "var(--text-3)",
                fontSize: 13,
                textAlign: "center",
              }}>
                No active subscribers yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {uniqueSubscribers.map((student) => {
                  const initials = (student.name || "S")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <div key={student._id} style={{
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "var(--bg-3)",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                        <div style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: student.avatar
                            ? `url(${student.avatar}) center/cover no-repeat`
                            : "linear-gradient(135deg, #00E5C3, #0A8FE8)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 700,
                          fontSize: 14,
                          flexShrink: 0,
                        }}>
                          {!student.avatar && initials}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>
                            {student.name || "Student"}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {student.college || "College not available"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/alumni/dashboard/messages?user=${student._id}`)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 9,
                          border: "1px solid rgba(0,229,195,0.25)",
                          background: "rgba(0,229,195,0.1)",
                          color: "var(--teal)",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "Plus Jakarta Sans",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        Message
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={openPayment}
        onClose={() => setOpenPayment(false)}
        course={{
          title: "Alumni Membership Activation",
          instructor: user?.name || "You",
          price: 199,
        }}
        skipEnrollment
        onPaymentSuccess={onActivateSuccess}
      />
    </MainLayout>
  );
}
