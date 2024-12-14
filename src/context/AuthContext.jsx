import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [currency, setCurrency] = useState("USD"); // Default currency
  const [theme, setTheme] = useState("light"); // Default theme

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  useEffect(() => {
    document.body.className = theme; // Apply theme class to body
  }, [theme]);

  const toggleCurrency = () => setCurrency((prev) => (prev === "USD" ? "EUR" : "USD"));

  return (
    <AuthContext.Provider value={{ authToken, user, currency, theme, login, logout, toggleTheme, toggleCurrency }}>
      {children}
    </AuthContext.Provider>
  );
};
