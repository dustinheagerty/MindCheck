import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("mindcheck_token"));

  function login(token) {
    localStorage.setItem("mindcheck_token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("mindcheck_token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}