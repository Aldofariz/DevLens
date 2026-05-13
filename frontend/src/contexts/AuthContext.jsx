import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, register as registerApi } from "../services/api/auth";
import api from "../utils/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: verify session by calling /projects (since /auth/me is missing from spec)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    api.get("api/projects")
      .then(() => {
        // Session is valid, if we have a saved user, we keep it.
        // If not, we might still be logged in but don't have user info (rare).
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const userData = res.data.user;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return res;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
