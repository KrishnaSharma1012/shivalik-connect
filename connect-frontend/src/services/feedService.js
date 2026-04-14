import API from "../utils/api";

// 📥 Get posts
export async function getPosts() {
  const res = await API.get("/posts");
  return res.data;
}

// ➕ Create post
export async function createPost(content) {
  const res = await API.post("/posts", { content });
  return res.data;
}

// ❤️ Like post
export async function likePost(postId) {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data;
}