import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import PostCard from "../../../components/feed/PostCard";
import { getPosts } from "../../../services/feedService";

const FilterTabs = ["All", "Connected", "Trending", "Current Activity"];

export default function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openAlumniProfile = (post) => {
    navigate(`/profile/${post.author._id}`);
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Connected") return p.author?.isVerified || p.author?.verified;
    if (activeTab === "Trending") {
      const likesCount = Array.isArray(p.likes) ? p.likes.length : (p.likes || 0);
      return likesCount >= 5;
    }
    if (activeTab === "Current Activity") return true;
    return true;
  });

  return (
    <MainLayout>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 0" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontWeight: 800, fontSize: 24 }}>Home Feed</h1>
          <p style={{ fontSize: 14, color: "gray" }}>
            Real posts from your network
          </p>
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {FilterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: activeTab === tab ? "#7C5CFC" : "#eee",
                color: activeTab === tab ? "white" : "#555",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && <p>Loading posts...</p>}

        {/* POSTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onOpenProfile={() => openAlumniProfile(post)}
            />
          ))}
        </div>

        {/* EMPTY */}
        {!loading && filteredPosts.length === 0 && (
          <p style={{ textAlign: "center" }}>No posts found</p>
        )}
      </div>
    </MainLayout>
  );
}