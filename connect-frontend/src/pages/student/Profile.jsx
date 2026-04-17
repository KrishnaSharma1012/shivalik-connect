import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProfileCard from "../../components/profile/ProfileCard";
import EditProfile from "../../components/profile/EditProfile";
import Stats from "../../components/profile/Stats";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";

const ListItem = ({ title, subtitle, tag, tagColor }) => (
  <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-3)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--text-3)" }}>{subtitle}</div>
    </div>
    {tag && (
      <span style={{ fontSize: 11, fontWeight: 700, color: tagColor || "var(--text-3)", background: "rgba(255,255,255,0)", border: `1px solid ${tagColor || "var(--border)"}`, borderRadius: 99, padding: "3px 8px" }}>
        {tag}
      </span>
    )}
  </div>
);

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [activeMembershipList, setActiveMembershipList] = useState([]);
  const pendingRequests = user?.connectionRequests?.filter(r => r.status === 'pending') || [];
  const resolvedRequests = user?.connectionRequests?.filter(r => r.status !== 'pending') || [];

  const stats = [
    { label: "Connections",       value: user?.connections?.length || 0  },
    { label: "Courses Enrolled",  value: user?.enrolledCourses?.length || 0   },
    { label: "Sessions Attended", value: user?.enrolledSessions?.length || 0  },
    { label: "Pending Requests",  value: pendingRequests.length  },
  ];

  const [open, setOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const previousMembershipList = [];
  const activeMemberships = activeMembershipList.length;

  useEffect(() => {
    if (!user) return;

    const fetchMemberships = async () => {
      setMembershipsLoading(true);
      try {
        const res = await API.get("/users/alumni-memberships");
        const alumni = res?.data?.alumni || [];

        const active = alumni
          .filter((a) => Boolean(a.membershipTaken || a.subscribed))
          .map((a) => ({
            id: a._id,
            name: a.name || "Alumni",
            company: a.company || "Company not available",
            plan: "Monthly",
            since: a.membershipTakenAt
              ? new Date(a.membershipTakenAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Active",
            amount: "₹199/mo",
          }));

        setActiveMembershipList(active);
      } catch (err) {
        console.error("Failed to load membership list:", err);
        setActiveMembershipList([]);
      } finally {
        setMembershipsLoading(false);
      }
    };

    fetchMemberships();
  }, [user]);

  const handleAvatarChange = async (base64) => {
    try {
      await updateUser({ avatar: base64 });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload profile photo. Please try again.");
    }
  };

  const handleCoverChange = async (base64) => {
    try {
      await updateUser({ coverPhoto: base64 });
    } catch (err) {
      console.error("Cover photo upload failed:", err);
      alert("Failed to upload cover photo. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 20 }}>

        <div style={{ marginBottom: 4 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>Your public profile visible to alumni</p>
        </div>

        <ProfileCard
          user={user}
          onEdit={() => setOpen(true)}
          onAvatarChange={handleAvatarChange}
          onCoverChange={handleCoverChange}
        />

        <Stats stats={stats} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Enrolled Courses */}
          <div style={{ padding: 20, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 700 }}>Enrolled Courses</h3>
            {user?.enrolledCourses?.length > 0 ? user.enrolledCourses.map((ec, i) => (
              <ListItem key={i} title={ec.course?.title || "Unknown Course"} subtitle={`Enrolled: ${new Date(ec.enrolledAt).toLocaleDateString()}`} />
            )) : <p style={{ fontSize: 13, color: "var(--text-3)" }}>No enrolled courses.</p>}
          </div>

          {/* Enrolled Sessions */}
          <div style={{ padding: 20, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 700 }}>Enrolled Sessions</h3>
            {user?.enrolledSessions?.length > 0 ? user.enrolledSessions.map((es, i) => (
              <ListItem key={i} title={es.session?.title || "Unknown Session"} subtitle={`Date: ${es.session?.date ? new Date(es.session.date).toLocaleDateString() : 'TBD'}`} />
            )) : <p style={{ fontSize: 13, color: "var(--text-3)" }}>No enrolled sessions.</p>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Connections */}
          <div style={{ padding: 20, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 700 }}>Connections ({user?.connections?.length || 0})</h3>
            {user?.connections?.length > 0 ? user.connections.map((c, i) => (
              <ListItem key={i} title={c.name} subtitle={`${c.title || ""} at ${c.company || ""}`} />
            )) : <p style={{ fontSize: 13, color: "var(--text-3)" }}>No connections yet.</p>}
          </div>

          {/* Connection Requests */}
          <div style={{ padding: 20, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16, fontWeight: 700 }}>Connection Requests</h3>
            {pendingRequests.length > 0 && <div>
              <h4 style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>Pending</h4>
              {pendingRequests.map((r, i) => (
                <ListItem key={`p${i}`} title={r.alumni?.name || "Unknown Alumni"} subtitle="Waiting for approval" tag="Pending" tagColor="#F5C842" />
              ))}
            </div>}
            {resolvedRequests.length > 0 && <div style={{ marginTop: 12 }}>
              <h4 style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>Resolved</h4>
              {resolvedRequests.map((r, i) => (
                <ListItem key={`r${i}`} title={r.alumni?.name || "Unknown Alumni"} subtitle={`Status: ${r.status}`} tag={r.status} tagColor={r.status === 'accepted' ? '#10B981' : '#EF4444'} />
              ))}
            </div>}
            {(pendingRequests.length === 0 && resolvedRequests.length === 0) && (
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>No connection requests.</p>
            )}
          </div>
        </div>

        <div style={{
          padding: "20px 22px",
          background: "linear-gradient(135deg, rgba(124,92,252,0.08), rgba(255,112,67,0.06))",
          border: "1px solid var(--border)",
          borderRadius: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
              Manage Memberships
            </h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F5C842", background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 99, padding: "4px 10px" }}>
              Active: {activeMemberships}
            </span>
          </div>

          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14 }}>
            View your alumni memberships, discover new mentors, and continue conversations with subscribed alumni.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setMembershipModalOpen(true)}
              style={{
                padding: "10px 14px",
                background: "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
                border: "none",
                borderRadius: 11,
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Plus Jakarta Sans",
                cursor: "pointer",
              }}
            >
              Manage Memberships
            </button>

            <button
              onClick={() => navigate("/messages")}
              style={{
                padding: "10px 14px",
                background: "var(--bg-3)",
                border: "1px solid var(--border)",
                borderRadius: 11,
                color: "var(--text-2)",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "Plus Jakarta Sans",
                cursor: "pointer",
              }}
            >
              Open Messages
            </button>
          </div>
        </div>

        <Modal isOpen={membershipModalOpen} onClose={() => setMembershipModalOpen(false)} title="Manage Memberships" size="md">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, marginBottom: 10, fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                Active Memberships ({activeMembershipList.length})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {membershipsLoading ? (
                  <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text-3)", fontSize: 13 }}>
                    Loading memberships...
                  </div>
                ) : activeMembershipList.length === 0 ? (
                  <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text-3)", fontSize: 13 }}>
                    You have no active memberships.
                  </div>
                ) : (
                  activeMembershipList.map((membership) => (
                    <div key={membership.id} style={{ padding: "12px 14px", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, background: "rgba(16,185,129,0.07)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{membership.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 99, padding: "3px 8px" }}>
                          Active
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                        {membership.company} • {membership.plan} • Since {membership.since} • {membership.amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h4 style={{ margin: 0, marginBottom: 10, fontFamily: "Plus Jakarta Sans", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                Previous Memberships ({previousMembershipList.length})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {previousMembershipList.length === 0 ? (
                  <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, color: "var(--text-3)", fontSize: 13 }}>
                    No previous memberships found.
                  </div>
                ) : (
                  previousMembershipList.map((membership) => (
                    <div key={membership.id} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-3)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{membership.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", background: "var(--bg-4)", border: "1px solid var(--border)", borderRadius: 99, padding: "3px 8px" }}>
                          Ended
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                        {membership.company} • Ended {membership.endedOn} • {membership.amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => navigate("/membership-alumni")}
                style={{
                  padding: "9px 12px",
                  background: "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "Plus Jakarta Sans",
                  cursor: "pointer",
                }}
              >
                Explore Alumni Memberships
              </button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={open} onClose={() => setOpen(false)} title="Edit Profile" size="md">
          <EditProfile
            user={user}
            onSave={async (updated) => {
              try {
                await updateUser(updated);
                setOpen(false);
              } catch (err) {
                console.error("Profile save failed:", err);
                alert("Failed to save profile. Please try again.");
              }
            }}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}