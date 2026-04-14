import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, updateUserProfile } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🚀 Fetch user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getCurrentUser();
          setUser(data.user || data);
        } catch (err) {
          console.error("Auth initialization failed", err);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 🔐 Login
  const login = (userData) => {
    setUser(userData);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✏️ Update user
  const updateUser = async (updatedData) => {
    try {
      const data = await updateUserProfile(updatedData);
      setUser(data.user || data);
      return data;
    } catch (err) {
      console.error("Profile update failed", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}


// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}