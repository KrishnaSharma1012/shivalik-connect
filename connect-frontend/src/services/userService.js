// ⏳ Fake delay (simulate API)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 👤 Get current user
export async function getCurrentUser() {
  await delay(300);

  const user = JSON.parse(localStorage.getItem("user"));
  return user;
}

// ✏️ Update user profile
export async function updateUserProfile(updatedData) {
  await delay(400);

  const existingUser = JSON.parse(localStorage.getItem("user")) || {};
  const newUser = { ...existingUser, ...updatedData };

  localStorage.setItem("user", JSON.stringify(newUser));

  return newUser;
}

// 🤝 Get all alumni (for networking)
export async function getAlumni() {
  await delay(500);

  return [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Software Engineer @ Google",
      college: "IIT Delhi",
    },
    {
      id: 2,
      name: "Ananya Verma",
      role: "Frontend Engineer @ Amazon",
      college: "DTU",
    },
    {
      id: 3,
      name: "Aman Gupta",
      role: "Data Scientist @ Microsoft",
      college: "NIT Trichy",
    },
  ];
}

// 🔍 Get single user by ID
export async function getUserById(id) {
  const users = await getAlumni();
  return users.find((user) => user.id === id);
}