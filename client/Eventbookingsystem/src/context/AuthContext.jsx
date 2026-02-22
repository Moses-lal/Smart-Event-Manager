import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || null
  );

  const setUser = (userData) => {
    if (userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
      setUserState(userData);
    } else {
      sessionStorage.removeItem("userData");
      setUserState(null);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("userData");
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);