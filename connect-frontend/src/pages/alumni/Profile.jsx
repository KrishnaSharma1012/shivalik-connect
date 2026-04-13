import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import ProfileCard from "../../components/profile/ProfileCard";
import EditProfile from "../../components/profile/EditProfile";
import Stats from "../../components/profile/Stats";
import Modal from "../../components/common/Modal";
import PostCard from "../../components/feed/PostCard";
import { getPostsByAlumniName } from "../../utils/alumniData";

function AlumniProfile() {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const [user, setUser] = useState({
    name: "Rahul Sharma",
    role: "Software Engineer @ Google",
    college: "IIT Delhi",
    about: "Helping students crack top tech companies. 5+ years of experience.",
    skills: ["DSA", "System Design", "React"],
  });

  const handleAvatarChange = (url) => setAvatar(url);
  const handleCoverChange = (url) => setCoverPhoto(url);

  const stats = [
    { label: "Sessions Taken", value: 45 },
    { label: "Students Mentored", value: 200 },
    { label: "Courses", value: 6 },
    { label: "Earnings", value: "₹60K" },
  ];

  const alumniPosts = getPostsByAlumniName(user.name);

  return (
    <MainLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720, margin: "0 auto", padding: "24px 0" }}>
        <ProfileCard
          user={{ ...user, avatar, coverPhoto }}
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

          {alumniPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 20px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <p style={{ fontSize: 14, color: "var(--text-3)", margin: 0 }}>No posts found for this alumni profile yet.</p>
            </div>
          ) : (
            alumniPosts.map((post) => (
              <PostCard key={post.id} post={post} />
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
            onSave={(updated) => {
              setUser(updated);
              setOpen(false);
            }}
          />
        </Modal>

      </div>
    </MainLayout>
  );
}

export default AlumniProfile;