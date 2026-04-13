import React, { createContext, useContext, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // 🔐 Login
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✏️ Update user (profile edit)
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}