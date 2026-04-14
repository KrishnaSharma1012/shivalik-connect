import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import CreatePost from "../../../components/feed/CreatePost";
import PostCard from "../../../components/feed/PostCard";
import CrownIcon from "../../../components/common/CrownIcon";
import PaymentModal from "../../../components/academics/PaymentModal";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../utils/api";


import { DUMMY_POSTS } from "../../../utils/mockData";

export default function AlumniFeed() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const isPremium = user?.alumniPlan === "premium";
  const [posts, setPosts] = React.useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      const fetchedPosts = res.data.posts || [];
      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
      } else {
        setPosts(DUMMY_POSTS);
      }
    } catch(err) {
      console.error(err);
      setPosts(DUMMY_POSTS);
    }
  };


  const addPost = async (newPost) => {
    try {
      const res = await API.post("/posts", { content: newPost.content });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

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