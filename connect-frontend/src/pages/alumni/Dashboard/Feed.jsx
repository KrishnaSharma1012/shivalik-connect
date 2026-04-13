import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import CreatePost from "../../../components/feed/CreatePost";
import PostCard from "../../../components/feed/PostCard";
import CrownIcon from "../../../components/common/CrownIcon";
import PaymentModal from "../../../components/academics/PaymentModal";
import { useAuth } from "../../../context/AuthContext";

const INITIAL_POSTS = [
  {
    id: 1,
    author: "Rahul Sharma",
    role: "SWE @ Google",
    content: "Excited to host a System Design session this weekend! 200+ students joined my last one 🚀\n\nThis time covering Netflix, Uber, WhatsApp architectures — register via the Academics tab.\n\n🗓 Saturday 11 AM IST | 🎓 All levels welcome",
    time: "2h ago",
    likes: 94,
    verified: true,
    has24h: true,
    isPremium: true,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80", name: "session.jpg" },
      { type: "image", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80", name: "students.jpg" },
    ],
  },
  {
    id: 2,
    author: "Priya Nair",
    role: "Data Scientist @ Microsoft",
    content: "Thrilled to announce I just completed the Google Cloud Professional Data Engineer certification! This one was a journey 🙏\n\nIf you're in data and want to know the best path to cloud certs, happy to chat!",
    time: "Yesterday",
    likes: 142,
    verified: true,
    postType: "certificate",
    certificate: {
      title: "Professional Data Engineer – Google Cloud",
      issuer: "Google Cloud",
      date: "March 2025",
    },
  },
  {
    id: 3,
    author: "Ananya Verma",
    role: "PM @ Amazon",
    content: "React tip of the day: Stop using useEffect for derived state.\n\nIf you can compute something from existing state/props, just compute it directly in render. Saves performance + mental overhead.\n\nFull post →",
    time: "Yesterday",
    likes: 231,
    verified: true,
    linkUrl: "https://dev.to",
  },
  {
    id: 4,
    author: "Sneha Joshi",
    role: "UX Lead @ Flipkart",
    content: "Design Thinking for Engineers — FREE workshop this Saturday!\n\nAfter 3 sold-out sessions, I'm back with a bigger one. Register before Sunday midnight, seats filling fast 🎨",
    time: "2 days ago",
    likes: 176,
    verified: true,
    postType: "poster",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80", name: "workshop-poster.jpg" },
    ],
  },
  {
    id: 5,
    author: "Karan Mehta",
    role: "FAANG SWE",
    content: "Just earned my third AWS certification — Solutions Architect Professional 💪\n\nTook 3 attempts. Here's what worked on attempt 3: focus on scenarios, not memorization. Happy to share my notes!",
    time: "3 days ago",
    likes: 289,
    verified: true,
    postType: "certificate",
    certificate: {
      title: "AWS Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "April 2025",
    },
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80", name: "aws-badge.jpg" },
    ],
  },
];

export default function AlumniFeed() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isPremium = user?.alumniPlan === "premium";
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const addPost = (newPost) => setPosts([{ ...newPost, verified: true, isPremium: true }, ...posts]);

  const handleGoPremium = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);

    if (user?.role === "alumni") updateUser({ alumniPlan: "premium" });
    else navigate("/signup", { state: { role: "alumni", plan: "premium" } });
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 0" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Alumni Feed</h1>
            {isPremium ? (
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <CrownIcon size={18} />
              </span>
            ) : (
              <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-3)" }}>Free Plan</span>
            )}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>Share insights, tips & session announcements</p>
        </div>

        {!isPremium && (
          <div style={{
            padding: "14px 18px", marginBottom: 20,
            background: "linear-gradient(135deg, rgba(255,112,67,0.08), rgba(255,154,108,0.06))",
            border: "1px solid rgba(255,112,67,0.2)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>🆓</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>Free Plan — Post, connect & message students</p>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>Upgrade to Premium to create paid sessions, courses & workshops</p>
              </div>
            </div>
            <button onClick={handleGoPremium} style={{
              padding: "8px 16px", flexShrink: 0,
              background: "linear-gradient(135deg, #FF7043, #FF9A6C)", border: "none", borderRadius: 10,
              color: "white", fontSize: 12, fontWeight: 700, fontFamily: "Plus Jakarta Sans", cursor: "pointer",
            }}>Go Premium →</button>
          </div>
        )}

        <CreatePost onAddPost={addPost} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{ animation: "fadeUp 0.35s ease both", animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
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
      </div>
    </MainLayout>
  );
}