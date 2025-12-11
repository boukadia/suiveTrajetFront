import { createContext, useState, useEffect } from "react";
import { validateApi } from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Vérifier token à chaque chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateApi(token).then((data) => {
        if (data.valid) setUser(data.user);
        else localStorage.removeItem("token");
      });
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
