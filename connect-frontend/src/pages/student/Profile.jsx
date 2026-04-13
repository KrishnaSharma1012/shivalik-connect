import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProfileCard from "../../components/profile/ProfileCard";
import EditProfile from "../../components/profile/EditProfile";
import Stats from "../../components/profile/Stats";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { label: "Connections",       value: 25  },
  { label: "Courses Enrolled",  value: 4   },
  { label: "Sessions Attended", value: 10  },
  { label: "Mentors Connected", value: 8   },
];

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [coverPhoto, setCoverPhoto] = useState(user?.coverPhoto || null);
  const activeMembershipList = user?.activeMembershipList || [
    { id: 1, name: "Rahul Sharma", company: "Google", plan: "Monthly", since: "Jan 2026", amount: "Rs.199/mo" },
    { id: 2, name: "Meera Pillai", company: "Flipkart", plan: "Monthly", since: "Mar 2026", amount: "Rs.199/mo" },
  ];
  const previousMembershipList = user?.previousMembershipList || [
    { id: 3, name: "Karan Bhatia", company: "Microsoft", endedOn: "Dec 2025", amount: "Rs.199/mo" },
  ];
  const activeMemberships = user?.activeMemberships ?? activeMembershipList.length;

  const handleAvatarChange = (url) => {
    setAvatar(url);
    updateUser?.({ avatar: url });
  };

  const handleCoverChange = (url) => {
    setCoverPhoto(url);
    updateUser?.({ coverPhoto: url });
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 20 }}>

        <div style={{ marginBottom: 4 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>Your public profile visible to alumni</p>
        </div>

        <ProfileCard
          user={{ ...user, skills: user?.skills || ["DSA", "React", "Problem Solving"], avatar, coverPhoto }}
          onEdit={() => setOpen(true)}
          onAvatarChange={handleAvatarChange}
          onCoverChange={handleCoverChange}
        />

        <Stats stats={stats} />

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
                {activeMembershipList.length === 0 ? (
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
            onSave={(updated) => {
              updateUser?.(updated);
              setOpen(false);
            }}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}