import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mindcheck_token');
    if (token) {
      authService.me()
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('mindcheck_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function login(token, user) {
    localStorage.setItem('mindcheck_token', token);
    setUser(user);
  }

  function logout() {
    authService.logout().catch(() => {});
    localStorage.removeItem('mindcheck_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
