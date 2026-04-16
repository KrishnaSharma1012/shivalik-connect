import React, { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import ProfileCard from "../../components/profile/ProfileCard";
import EditProfile from "../../components/profile/EditProfile";
import Stats from "../../components/profile/Stats";
import Modal from "../../components/common/Modal";
import PostCard from "../../components/feed/PostCard";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

function AlumniProfile() {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState([
    { label: "Sessions Taken", value: 0 },
    { label: "Students Mentored", value: 0 },
    { label: "Courses", value: 0 },
    { label: "Earnings", value: "₹0" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [postsRes, earningsRes, sessionsRes, coursesRes] = await Promise.all([
          API.get("/posts/my"),
          API.get("/earnings/stats"),
          API.get("/sessions/my"),
          API.get("/courses/my"),
        ]);

        setPosts(postsRes.data.posts || []);

        const statsData = earningsRes.data;
        setStats([
          { label: "Sessions Taken", value: sessionsRes.data.sessions?.length || 0 },
          { label: "Students Mentored", value: statsData?.totalTransactions || 0 },
          { label: "Courses", value: coursesRes.data.courses?.length || 0 },
          { label: "Earnings", value: `₹${(statsData?.totalGross || 0).toLocaleString()}` },
        ]);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAvatarChange = async (base64) => {
    try {
      await updateUser({ avatar: base64 });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload avatar. Please try again.");
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

  const handleSaveProfile = async (updated) => {
    try {
      await updateUser(updated);
      setOpen(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720, margin: "0 auto", padding: "24px 0" }}>
        <ProfileCard
          user={user}
          onEdit={() => setOpen(true)}
          onAvatarChange={handleAvatarChange}
          onCoverChange={handleCoverChange}
        />

        {/* Stats */}
        <Stats stats={stats} />

        {/* Alumni Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, color: "var(--text)", margin: 0 }}>
            My Posts
          </h2>

          {loading ? (
            <p style={{ color: "var(--text-3)", textAlign: "center" }}>Loading posts...</p>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 20px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <p style={{ fontSize: 14, color: "var(--text-3)", margin: 0 }}>No posts found for your profile yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Edit Profile"
        >
          <EditProfile
            user={user}
            onSave={handleSaveProfile}
          />
        </Modal>

      </div>
    </MainLayout>
  );
}

export default AlumniProfile;