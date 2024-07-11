import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://tastykitchen-backend.vercel.app/auth/validate", {
          headers: { Authorization: token },
        })
        .then(() => {
          setAuthState({ token, isAuthenticated: true });
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthState({ token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
