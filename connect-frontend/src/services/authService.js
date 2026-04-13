// 🔐 Fake delay to simulate API
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔑 Login
export async function loginUser({ email, password, role }) {
  await delay(500);

  if (!email || !password) {
    throw new Error("Invalid credentials");
  }

  // Fake user response (replace with API later)
  return {
    id: Date.now(),
    name: "User",
    email,
    role,
  };
}

// 📝 Signup
export async function signupUser({
  name,
  email,
  password,
  role,
}) {
  await delay(500);

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  return {
    id: Date.now(),
    name,
    email,
    role,
  };
}

// 🚪 Logout
export function logoutUser() {
  // In real app: call backend API
  return true;
}