import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import API from "../../../utils/api";

const getDummyMyPosts = () => {
  const userId = localStorage.getItem("userId") || "mock-user-id";
  return [
    {
      _id: "mp1",
      author: { _id: userId, name: "You", role: "alumni", isVerified: true, company: "Tech Inc." },
      content: "This is my first post on the platform! Excited to connect with students.",
      likes: ["u2", "u3"],
      comments: [{ _id: "c1", author: { name: "Student A" }, content: "Welcome!" }],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "mp2",
      author: { _id: userId, name: "You", role: "alumni", isVerified: true, company: "Tech Inc." },
      content: "I will be hosting a resume review workshop next week.",
      likes: ["u5", "u6", "u7"],
      comments: [],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
};

// Icons
const HeartIcon = ({ filled }) => (
  <span>{filled ? "❤️" : "🤍"}</span>
);

const CommentIcon = () => <span>💬</span>;

// ─────────────────────────────
// POST CARD
// ─────────────────────────────
function MyPostCard({ post, onEdit, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  // LIKE
  const handleLike = async () => {
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikes(res.data.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  // COMMENT
  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await API.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });

      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
      <h4>{post.author?.name || "You"}</h4>
      <p>{post.content}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleLike}>
          <HeartIcon filled={liked} /> {likes}
        </button>

        <button>
          <CommentIcon /> {comments.length}
        </button>

        <button onClick={() => onEdit(post)}>Edit</button>
        <button onClick={() => onDelete(post._id)}>Delete</button>
      </div>

      {/* COMMENTS */}
      <div style={{ marginTop: 10 }}>
        {comments.map((c) => (
          <p key={c._id}>
            <b>{c.author?.name}</b>: {c.content}
          </p>
        ))}

        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add comment"
        />
        <button onClick={handleComment}>Post</button>
      </div>
    </div>
  );
}

// ─────────────────────────────
// MAIN PAGE
// ─────────────────────────────
export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");

        let myPosts = [];
        if (res.data.posts && res.data.posts.length > 0) {
          myPosts = res.data.posts.filter(
            (p) => p.author?._id === localStorage.getItem("userId")
          );
        }
        
        if (myPosts.length === 0) {
          myPosts = getDummyMyPosts();
        }

        setPosts(myPosts);
      } catch (err) {
        console.error(err);
        setPosts(getDummyMyPosts());
      }
    };

    fetchPosts();
  }, []);

  // EDIT
  const handleSave = async (id, content) => {
    try {
      const res = await API.put(`/posts/${id}`, { content });

      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data.post : p))
      );

      setEditingPost(null);
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 600, margin: "auto" }}>
        <h2>My Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <MyPostCard
              key={post._id}
              post={post}
              onEdit={setEditingPost}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}