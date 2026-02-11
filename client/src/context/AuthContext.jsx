import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage on mount (already done in initial state)
    if (token && role) {
      // Ideally verify token validity here or decode it.
      // For now, assume it's valid until a 401 occurs.
    }
  }, [token, role]);

  const login = (newToken, newRole, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    if(userData) localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setRole(newRole);
    setUser(userData);
    
    if (newRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setToken(null);
    setRole(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
