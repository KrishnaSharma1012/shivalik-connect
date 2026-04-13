// ⏳ Fake delay (simulate API)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 📥 Get posts
export async function getPosts() {
  await delay(500);

  return [
    {
      id: 1,
      author: "Rahul (Google)",
      content: "Sharing my journey to crack Google 🚀",
      time: "2h ago",
      likes: 12,
    },
    {
      id: 2,
      author: "Ananya (Amazon)",
      content: "Tips for frontend interviews 💻",
      time: "5h ago",
      likes: 8,
    },
  ];
}

// ➕ Create post
export async function createPost(content) {
  await delay(300);

  if (!content.trim()) {
    throw new Error("Post cannot be empty");
  }

  return {
    id: Date.now(),
    author: "You",
    content,
    time: "Just now",
    likes: 0,
  };
}

// ❤️ Like post
export async function likePost(postId, currentLikes) {
  await delay(200);

  return {
    postId,
    likes: currentLikes + 1,
  };
}